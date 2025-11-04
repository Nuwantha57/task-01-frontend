const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function buildDriver() {
  const headless = (process.env.HEADLESS || 'true').toLowerCase() !== 'false';
  const options = new chrome.Options();
  
  if (headless) {
    // Use headless mode for CI/CD
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
  }
  
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1366,900');
  options.addArguments('--disable-blink-features=AutomationControlled');
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-notifications');
  
  // Build driver with chromedriver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Set timeouts
  await driver.manage().setTimeouts({ 
    implicit: 2000, 
    pageLoad: 60000, 
    script: 30000 
  });
  
  return driver;
}

module.exports = { buildDriver };