const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('./helpers/driver');
require('./setup');

const BASE = process.env.BASE_URL;

describe('Audit Logs', function() {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
    await driver.get(`${BASE}/admin/audit-log`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_dummy_token')");
    await driver.navigate().refresh();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('renders filters and table area', async () => {
    await driver.wait(until.elementLocated(By.css('h2')), 15000);
    const heading = await driver.findElement(By.css('h2')).getText();
    expect(heading).to.equal('Audit Logs');

    // Filters present
    await driver.findElement(By.css("input[name='userId']"));
    await driver.findElement(By.css("input[name='eventType']"));
    await driver.findElement(By.css("input[name='range']"));

    // Action buttons
    await driver.findElement(By.css('.btn-apply'));
    await driver.findElement(By.css('.btn-reset'));

    // Table exists
    await driver.findElement(By.css('table'));
  });

  it('applies filters and resets them', async () => {
    let userId = await driver.findElement(By.css("input[name='userId']"));
    let eventType = await driver.findElement(By.css("input[name='eventType']"));

    await userId.clear();
    await userId.sendKeys('123');
    await eventType.clear();
    await eventType.sendKeys('LOGIN');

    const apply = await driver.findElement(By.css('.btn-apply'));
    await apply.click();

    // Wait for either error or table update or no-data row
    await driver.wait(async () => {
      const errors = await driver.findElements(By.css('.error-message'));
      const rows = await driver.findElements(By.css('tbody tr'));
      return errors.length > 0 || rows.length >= 1;
    }, 15000);

    // Reset filters
    const reset = await driver.findElement(By.css('.btn-reset'));
    await reset.click();

    // Re-locate inputs after potential re-render
    await driver.wait(until.elementLocated(By.css("input[name='userId']")), 10000);
    userId = await driver.findElement(By.css("input[name='userId']"));
    eventType = await driver.findElement(By.css("input[name='eventType']"));

    // Inputs should be cleared back to empty strings
    expect(await userId.getAttribute('value')).to.equal('');
    expect(await eventType.getAttribute('value')).to.equal('');
  });
});
