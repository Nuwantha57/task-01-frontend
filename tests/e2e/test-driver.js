// Quick test to verify ChromeDriver works
const { buildDriver } = require('./helpers/driver');

async function testDriver() {
  console.log('Testing ChromeDriver setup...');
  let driver;
  
  try {
    console.log('Building driver...');
    driver = await buildDriver();
    console.log('✓ Driver built successfully');
    
    console.log('Navigating to Google...');
    await driver.get('https://www.google.com');
    console.log('✓ Navigation successful');
    
    const title = await driver.getTitle();
    console.log('✓ Page title:', title);
    
    console.log('\n✓✓✓ ChromeDriver is working correctly! ✓✓✓\n');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('Driver closed');
    }
  }
}

testDriver();
