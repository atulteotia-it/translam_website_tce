#!/usr/bin/env node
/**
 * Test Director Desk API endpoints directly
 */

require('dotenv').config();

async function testDirectorDeskAPI() {
  console.log('🧪 Testing Director Desk API Endpoints\n');
  
  const API_BASE = 'http://localhost:4000/api';
  
  // Test 1: GET endpoint
  console.log('📥 Step 1: Testing GET /director-desk...');
  try {
    const response = await fetch(`${API_BASE}/director-desk`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ GET request successful');
      console.log('📊 Response data structure:', {
        hasId: !!data.id,
        hasHeroTitle: !!data.heroTitle,
        hasHeroBannerImage: !!data.heroBannerImage,
        heroBannerImageLength: data.heroBannerImage ? data.heroBannerImage.length : 0,
        hasStaffMembers: Array.isArray(data.staffMembers),
        staffMembersCount: Array.isArray(data.staffMembers) ? data.staffMembers.length : 0,
        contentLength: data.content ? data.content.length : 0
      });
    } else {
      const errorText = await response.text();
      console.log('❌ GET request failed');
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ GET request error:', error.message);
  }
  
  console.log('\n📤 Step 2: Testing PUT /director-desk...');
  
  // Test 2: PUT endpoint with minimal data
  const testData = {
    heroTitle: 'TEST DIRECTOR DESK',
    heroBannerImage: '', // Start with empty image
    mainHeading: 'Test Main Heading',
    content: '<p>Test content for director desk</p>',
    staffMembers: [
      {
        name: 'Test Director',
        title: 'Director',
        image: ''
      }
    ]
  };
  
  try {
    console.log('Sending minimal test data...');
    console.log('📊 Test data size:', JSON.stringify(testData).length, 'bytes');
    
    const response = await fetch(`${API_BASE}/director-desk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ PUT request successful with minimal data');
      console.log('📊 Returned ID:', result.id);
    } else {
      const errorText = await response.text();
      console.log('❌ PUT request failed with minimal data');
      console.log('Error response:', errorText);
      
      // Try to parse as JSON for better error details
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Error details:', errorJson);
      } catch {
        console.log('Raw error text:', errorText);
      }
    }
  } catch (error) {
    console.log('❌ PUT request error:', error.message);
  }
  
  // Test 3: PUT with larger data (small base64 image)
  console.log('\n📤 Step 3: Testing PUT with base64 image...');
  
  const testDataWithImage = {
    ...testData,
    heroBannerImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // Tiny 1x1 pixel PNG
    staffMembers: [
      {
        name: 'Test Director',
        title: 'Director',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      }
    ]
  };
  
  try {
    console.log('Sending data with small base64 images...');
    console.log('📊 Test data with image size:', JSON.stringify(testDataWithImage).length, 'bytes');
    
    const response = await fetch(`${API_BASE}/director-desk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDataWithImage),
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ PUT request successful with base64 images');
      console.log('📊 Returned data has image:', result.heroBannerImage ? result.heroBannerImage.length > 0 : false);
    } else {
      const errorText = await response.text();
      console.log('❌ PUT request failed with base64 images');
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ PUT request with images error:', error.message);
  }
  
  console.log('\n🔍 Step 4: Checking database directly...');
  
  // Test 4: Check database directly
  const mysql = require('mysql2/promise');
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'translam',
    port: process.env.DB_PORT || 3306
  };
  
  try {
    const connection = await mysql.createConnection(config);
    await connection.execute(`USE \`${config.database}\``);
    
    const [rows] = await connection.execute('SELECT * FROM DirectorDesks ORDER BY id DESC LIMIT 1');
    
    if (rows.length > 0) {
      const row = rows[0];
      console.log('✅ Database record found');
      console.log('📊 Database record:', {
        id: row.id,
        heroTitle: row.heroTitle,
        heroBannerImageLength: row.heroBannerImage ? row.heroBannerImage.length : 0,
        contentLength: row.content ? row.content.length : 0,
        staffMembersLength: row.staffMembers ? row.staffMembers.length : 0,
        hasStaffMembersData: row.staffMembers ? row.staffMembers !== '[]' : false
      });
      
      // Try to parse staffMembers
      try {
        const staffMembers = JSON.parse(row.staffMembers || '[]');
        console.log('📊 Staff members parsed successfully:', staffMembers.length, 'members');
      } catch (error) {
        console.log('❌ Could not parse staffMembers JSON:', error.message);
      }
    } else {
      console.log('⚠️ No DirectorDesk records found in database');
    }
    
    await connection.end();
  } catch (error) {
    console.log('❌ Database check error:', error.message);
  }
  
  console.log('\n🎯 Summary:');
  console.log('If all tests passed, the API is working correctly.');
  console.log('If any failed, the error messages above should help identify the issue.');
  console.log('Check your browser console and network tab when saving from the form to see the exact error.');
}

testDirectorDeskAPI();