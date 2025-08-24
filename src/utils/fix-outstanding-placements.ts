/**
 * Fix for Outstanding Placements data migration
 * Handles large data by chunking or compressing it
 */

const API_BASE_URL = 'http://localhost:4000/api';

interface PlacementRecord {
  name?: string;
  company?: string;
  package?: string;
  year?: string;
  position?: string;
  [key: string]: any;
}

function compressPlacementData(placements: PlacementRecord[]): PlacementRecord[] {
  // Remove empty fields and compress data
  return placements.map(placement => {
    const compressed: PlacementRecord = {};
    
    // Only keep non-empty fields
    Object.entries(placement).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        compressed[key] = value.toString().trim();
      }
    });
    
    return compressed;
  });
}

function chunkPlacements(placements: PlacementRecord[], maxSize: number = 50): PlacementRecord[][] {
  const chunks: PlacementRecord[][] = [];
  for (let i = 0; i < placements.length; i += maxSize) {
    chunks.push(placements.slice(i, i + maxSize));
  }
  return chunks;
}

async function testDataSize(data: any): Promise<boolean> {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = new Blob([jsonString]).size;
  const sizeInKB = sizeInBytes / 1024;
  
  console.log(`Data size: ${sizeInKB.toFixed(2)} KB`);
  
  // MySQL TEXT can handle up to 65KB, but let's be conservative
  return sizeInKB < 60; // 60KB limit
}

export async function fixOutstandingPlacementsMigration(): Promise<any> {
  const results: any = { success: false, message: '', data: null };
  
  try {
    const rawData = localStorage.getItem('outstandingPlacementsData');
    
    if (!rawData) {
      return { success: true, message: 'No Outstanding Placements data to migrate' };
    }
    
    const data = JSON.parse(rawData);
    console.log('📊 Original data structure:', data);
    
    let placements = data.placements || data.students || [];
    console.log(`📋 Found ${placements.length} placement records`);
    
    // Compress the data first
    const compressedPlacements = compressPlacementData(placements);
    console.log(`🗜️ Compressed to ${compressedPlacements.length} records`);
    
    let backendData = {
      heroTitle: data.title || data.heroTitle || 'Outstanding Placements',
      content: data.description || data.content || '',
      placements: compressedPlacements
    };
    
    // Test if the data is too large
    const isDataSizeOk = await testDataSize(backendData);
    
    if (!isDataSizeOk) {
      console.log('⚠️ Data too large, chunking placements...');
      
      // Split into chunks and only use the first chunk for now
      const chunks = chunkPlacements(compressedPlacements, 30);
      console.log(`📦 Split into ${chunks.length} chunks`);
      
      backendData.placements = chunks[0]; // Use first chunk
      console.log(`🔽 Using first chunk with ${chunks[0].length} records`);
      
      if (chunks.length > 1) {
        results.message += ` (Note: Only migrated first ${chunks[0].length} records due to size limits. `;
        results.message += `${placements.length - chunks[0].length} records remaining)`;
      }
    }
    
    console.log('📤 Sending to API:', {
      ...backendData,
      placements: `${backendData.placements.length} records`
    });
    
    const response = await fetch(`${API_BASE_URL}/outstanding-placements`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('✅ Migration successful!', responseData);
      
      results.success = true;
      results.message = `Outstanding Placements migrated successfully. ${results.message}`;
      results.data = responseData;
      
      // Only remove localStorage if migration was successful
      localStorage.removeItem('outstandingPlacementsData');
      
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      
      results.success = false;
      results.message = `API Error: ${response.status} - ${errorText}`;
    }
    
  } catch (error) {
    console.error('❌ Migration Error:', error);
    results.success = false;
    results.message = `Error: ${error}`;
  }
  
  return results;
}

export async function debugPlacementsSize(): Promise<void> {
  console.group('🔍 Outstanding Placements Size Debug');
  
  const rawData = localStorage.getItem('outstandingPlacementsData');
  
  if (!rawData) {
    console.log('❌ No data found');
    console.groupEnd();
    return;
  }
  
  try {
    const data = JSON.parse(rawData);
    const placements = data.placements || data.students || [];
    
    console.log('📊 Data Analysis:');
    console.log(`- Total records: ${placements.length}`);
    console.log(`- Raw data size: ${(new Blob([rawData]).size / 1024).toFixed(2)} KB`);
    
    if (placements.length > 0) {
      console.log(`- Sample record:`, placements[0]);
      console.log(`- Average record size: ${(new Blob([JSON.stringify(placements[0])]).size)} bytes`);
    }
    
    const compressedPlacements = compressPlacementData(placements);
    const compressedSize = new Blob([JSON.stringify(compressedPlacements)]).size / 1024;
    console.log(`- Compressed size: ${compressedSize.toFixed(2)} KB`);
    console.log(`- Size reduction: ${((1 - compressedSize / (new Blob([JSON.stringify(placements)]).size / 1024)) * 100).toFixed(1)}%`);
    
    // Show chunking options
    const chunks30 = chunkPlacements(compressedPlacements, 30);
    const chunks50 = chunkPlacements(compressedPlacements, 50);
    console.log(`- 30 records/chunk: ${chunks30.length} chunks`);
    console.log(`- 50 records/chunk: ${chunks50.length} chunks`);
    
  } catch (error) {
    console.error('❌ Error analyzing data:', error);
  }
  
  console.groupEnd();
}