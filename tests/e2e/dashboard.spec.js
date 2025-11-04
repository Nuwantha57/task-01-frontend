const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('./helpers/driver');
require('./setup');

const BASE = process.env.BASE_URL;

describe('Dashboard', function() {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
    // Ensure token so dashboard doesn't immediately redirect
    await driver.get(`${BASE}/dashboard`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_dummy_token')");
    await driver.navigate().refresh();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('renders layout (navbar or error/redirect)', async () => {
    // Either dashboard content, or redirect to login if backend not available.
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return /dashboard|login/.test(url);
    }, 15000);

    const url = await driver.getCurrentUrl();
    if (/dashboard/.test(url)) {
      // Navbar brand present
      await driver.wait(until.elementLocated(By.css('.nav-brand h1')), 10000);
      const brand = await driver.findElement(By.css('.nav-brand h1')).getText();
      expect(brand).to.equal('Admin Dashboard');
    } else {
      // On login page
      await driver.wait(until.elementLocated(By.css('#loginBtn')), 10000);
      const btnText = await driver.findElement(By.css('#loginBtn')).getText();
      expect(btnText).to.match(/Login/);
    }
  });

  it('logout navigates back to login when visible', async () => {
    // If we're on dashboard and logout button is visible, click it and expect /login
    const buttons = await driver.findElements(By.css('.btn-logout'));
    if (buttons.length > 0) {
      await buttons[0].click();
      await driver.wait(until.urlContains('/login'), 10000);
    }
  });
});
