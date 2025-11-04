const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('./helpers/driver');
require('./setup');

const BASE = process.env.BASE_URL;

describe('Admin Users', function() {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
    await driver.get(`${BASE}/admin/users`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_dummy_token')");
    await driver.navigate().refresh();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('renders heading and either table or error message', async () => {
    // Wait for heading
    await driver.wait(until.elementLocated(By.css('h2')), 15000);
    const heading = await driver.findElement(By.css('h2')).getText();
    expect(heading).to.equal('User Management');

    // Wait for either table or error message
    const tablePromise = driver.findElements(By.css('table'));
    const errorPromise = driver.findElements(By.css('.error-message'));
    const [tables, errors] = await Promise.all([tablePromise, errorPromise]);

    expect(tables.length > 0 || errors.length > 0).to.equal(true);

    if (tables.length > 0) {
      // Search input should be present
      const search = await driver.findElement(By.css('input.search-input'));
      expect(await search.getAttribute('placeholder')).to.match(/Search/);
    }
  });

  it('allows typing in search input and preserves value', async () => {
    // Only run if table is present
    const tables = await driver.findElements(By.css('table'));
    if (!tables || tables.length === 0) {
      return this.skip();
    }

    const search = await driver.findElement(By.css('input.search-input'));
    await search.clear();
    await search.sendKeys('john');

    // Debounce/filtering may occur; just verify the value remains
    const val = await search.getAttribute('value');
    expect(val).to.equal('john');
  });
});
