require('dotenv').config();
const { pool } = require('./src/config/database');

async function testShortNews() {
  try {
    console.log('Testing ShortNews queries...');
    
    // Test the GET query that's failing
    const [rows] = await pool.query('SELECT * FROM ShortNews ORDER BY createdAt DESC');
    console.log('Found', rows.length, 'short news records:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title} (Active: ${row.is_active})`);
    });
    
    console.log('\nRaw data:');
    console.log(JSON.stringify(rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    
    // Try with alternate column name
    try {
      console.log('\nTrying with created_at...');
      const [rows] = await pool.query('SELECT * FROM ShortNews ORDER BY created_at DESC');
      console.log('Found', rows.length, 'records with created_at');
    } catch (e) {
      console.log('created_at also failed:', e.message);
    }
    
    // Show table structure
    try {
      console.log('\nTable structure:');
      const [columns] = await pool.query('SHOW COLUMNS FROM ShortNews');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    } catch (e) {
      console.log('Could not show table structure:', e.message);
    }
    
    process.exit(1);
  }
}

testShortNews();