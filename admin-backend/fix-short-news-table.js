require('dotenv').config();
const { pool } = require('./src/config/database');

async function fixShortNewsTable() {
  try {
    console.log('Checking ShortNews table structure...');
    
    // First, check if the table exists
    const [tables] = await pool.query(
      "SHOW TABLES LIKE 'ShortNews'"
    );
    
    if (tables.length === 0) {
      console.log('ShortNews table does not exist. Creating it...');
      await pool.query(`
        CREATE TABLE ShortNews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('ShortNews table created successfully!');
    } else {
      console.log('ShortNews table exists. Checking for missing columns...');
      
      // Check existing columns
      const [columns] = await pool.query(
        "SHOW COLUMNS FROM ShortNews"
      );
      
      const columnNames = columns.map(col => col.Field);
      console.log('Existing columns:', columnNames);
      
      // Add created_at if missing
      if (!columnNames.includes('created_at')) {
        console.log('Adding created_at column...');
        await pool.query(
          "ALTER TABLE ShortNews ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        );
      }
      
      // Add updated_at if missing
      if (!columnNames.includes('updated_at')) {
        console.log('Adding updated_at column...');
        await pool.query(
          "ALTER TABLE ShortNews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        );
      }
      
      console.log('Table structure updated successfully!');
    }
    
    // Add some test data if table is empty
    const [count] = await pool.query('SELECT COUNT(*) as count FROM ShortNews');
    if (count[0].count === 0) {
      console.log('Adding sample data...');
      await pool.query(
        "INSERT INTO ShortNews (title, is_active) VALUES (?, ?), (?, ?)",
        [
          "Welcome to Translam - Excellence in Education", true,
          "Admissions Open for 2024-25 Academic Year", true
        ]
      );
      console.log('Sample data added!');
    }
    
    // Show final table structure
    const [finalColumns] = await pool.query("SHOW COLUMNS FROM ShortNews");
    console.log('\nFinal table structure:');
    finalColumns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixShortNewsTable();