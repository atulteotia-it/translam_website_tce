require('dotenv').config();
const { sequelize, ShortNews } = require('./models');

async function syncShortNewsTable() {
  try {
    console.log('Starting ShortNews table synchronization...');
    
    // This will create the table if it doesn't exist
    await ShortNews.sync({ alter: true });
    
    console.log('ShortNews table synchronized successfully!');
    
    // Add some initial data if table is empty
    const count = await ShortNews.count();
    console.log(`Found ${count} short news entries.`);
    
    if (count === 0) {
      console.log('Adding initial short news entries...');
      await ShortNews.bulkCreate([
        {
          title: "Welcome to Translam - Excellence in Education",
          is_active: true
        },
        {
          title: "Admissions Open for 2024-25 Academic Year",
          is_active: true
        }
      ]);
      console.log('Initial entries added successfully!');
    }
    
    // Describe the ShortNews table
    const [results] = await sequelize.query('DESCRIBE ShortNews');
    console.log('\nShortNews table structure:');
    results.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing ShortNews table:', error);
    process.exit(1);
  }
}

syncShortNewsTable();