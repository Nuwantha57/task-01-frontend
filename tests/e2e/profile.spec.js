const { By, until, Key } = require('selenium-webdriver');
const { buildDriver } = require('./helpers/driver');
require('./setup');

const BASE = process.env.BASE_URL;

describe('Profile Page', function() {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
    await driver.get(`${BASE}/profile`);
    await driver.executeScript("localStorage.setItem('id_token', 'test_dummy_token')");
    await driver.navigate().refresh();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('renders profile form and validates empty display name', async () => {
    await driver.wait(until.elementLocated(By.css('.profile-container h2')), 15000);
    const h2 = await driver.findElement(By.css('.profile-container h2')).getText();
    expect(h2).to.equal('My Profile');

    const displayName = await driver.findElement(By.css('#displayName'));
    await displayName.clear();

    const updateBtn = await driver.findElement(By.css('.btn-primary'));
    await updateBtn.click();

    // Expect client-side validation message
    await driver.wait(until.elementLocated(By.css('.message')), 10000);
    const msgText = await driver.findElement(By.css('.message')).getText();
    expect(msgText).to.include('Display name cannot be empty');
  });

  it('updates fields and attempts save, shows a result message', async () => {
    const displayName = await driver.findElement(By.css('#displayName'));
    await displayName.clear();
    await displayName.sendKeys('E2E Tester');

    const locale = await driver.findElement(By.css('#locale'));
    await locale.sendKeys(Key.HOME); // move to first option just to trigger change

    const updateBtn = await driver.findElement(By.css('.btn-primary'));
    await updateBtn.click();

    // Either success or error depending on backend
    await driver.wait(until.elementLocated(By.css('.message')), 15000);
    const msgText = await driver.findElement(By.css('.message')).getText();
    expect(/Profile updated successfully!|Failed to update profile|Failed to load profile/.test(msgText)).to.equal(true);
  });

  it('back to dashboard navigates away', async () => {
    const backBtn = await driver.findElement(By.css('.btn-back'));
    await backBtn.click();

    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return /dashboard|login/.test(url);
    }, 10000);
  });
});
