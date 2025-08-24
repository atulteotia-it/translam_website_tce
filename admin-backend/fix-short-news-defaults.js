require('dotenv').config();
const { pool } = require('./src/config/database');

async function fixShortNewsDefaults() {
  try {
    console.log('Fixing ShortNews table defaults...');
    
    // Drop the extra columns if they exist
    try {
      await pool.query('ALTER TABLE ShortNews DROP COLUMN created_at');
      console.log('Dropped created_at column');
    } catch (e) {
      console.log('created_at column does not exist or cannot be dropped');
    }
    
    try {
      await pool.query('ALTER TABLE ShortNews DROP COLUMN updated_at');
      console.log('Dropped updated_at column');
    } catch (e) {
      console.log('updated_at column does not exist or cannot be dropped');
    }
    
    // Modify existing columns to have default values
    console.log('Setting default values for createdAt and updatedAt...');
    
    await pool.query(`
      ALTER TABLE ShortNews 
      MODIFY COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    `);
    
    await pool.query(`
      ALTER TABLE ShortNews 
      MODIFY COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
    
    console.log('Default values set successfully!');
    
    // Show final table structure
    const [columns] = await pool.query('SHOW COLUMNS FROM ShortNews');
    console.log('\nFinal table structure:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) Default: ${col.Default || 'NULL'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixShortNewsDefaults();