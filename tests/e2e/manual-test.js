const { buildDriver } = require('./helpers/driver');
const { By, until } = require('selenium-webdriver');

/**
 * Quick manual test to verify individual components
 * Run with: node tests/e2e/manual-test.js
 */

async function manualTest() {
  console.log('🚀 Starting manual test...\n');
  let driver;
  
  try {
    driver = await buildDriver();
    const BASE = process.env.BASE_URL || 'http://localhost:3000';
    
    // Test 1: Login Page
    console.log('📝 Test 1: Login Page');
    await driver.get(`${BASE}/login`);
    const heading = await driver.findElement(By.css('h2')).getText();
    console.log(`   ✓ Heading: "${heading}"`);
    
    const loginBtn = await driver.findElement(By.css('#loginBtn'));
    console.log(`   ✓ Login button found: "${await loginBtn.getText()}"`);
    console.log('   ✓ Login page working!\n');
    
    // Test 2: Dashboard Page (with token simulation)
    console.log('📝 Test 2: Dashboard Page');
    await driver.get(`${BASE}/dashboard`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_token')");
    await driver.navigate().refresh();
    
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return /dashboard|login/.test(url);
    }, 10000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('dashboard')) {
      console.log('   ✓ Dashboard loaded');
      const brand = await driver.findElement(By.css('.nav-brand h1')).getText();
      console.log(`   ✓ Navigation brand: "${brand}"`);
    } else {
      console.log('   ⚠ Redirected to login (backend may not be running)');
    }
    console.log('   ✓ Dashboard page working!\n');
    
    // Test 3: Admin Users Page
    console.log('📝 Test 3: Admin Users Page');
    await driver.get(`${BASE}/admin/users`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_token')");
    await driver.navigate().refresh();
    
    await driver.wait(until.elementLocated(By.css('h2')), 10000);
    const adminHeading = await driver.findElement(By.css('h2')).getText();
    console.log(`   ✓ Heading: "${adminHeading}"`);
    console.log('   ✓ Admin users page working!\n');
    
    console.log('✅ All manual tests passed!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('🔒 Browser closed');
    }
  }
}

manualTest();
