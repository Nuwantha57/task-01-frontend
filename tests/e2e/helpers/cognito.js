const { By, until } = require('selenium-webdriver');

async function tryCognitoLogin(driver, { username, password }, timeout = 30000) {
  if (!username || !password) return { attempted: false, success: false, reason: 'missing-creds' };

  // Wait for hosted UI; proceed only if at cognito domain
  const url = await driver.getCurrentUrl();
  if (!/amazoncognito\.com/.test(url)) return { attempted: false, success: false, reason: 'not-on-cognito' };

  // Try common selectors from Cognito hosted UI new/old themes
  const usernameSelectors = ['#signInFormUsername', "input[name='username']", "input#username", "input[type='email']"];
  const passwordSelectors = ['#signInFormPassword', "input[name='password']", "input#password", "input[type='password']"];
  const submitSelectors = ['#signInFormSubmit', "button[type='submit']", "input[type='submit']", "button:contains('Sign in')"];

  async function findFirst(selectors) {
    for (const css of selectors) {
      try {
        const el = await driver.findElement(By.css(css));
        if (el) return el;
      } catch (_) {}
    }
    return null;
  }

  try {
    const userEl = await findFirst(usernameSelectors);
    const passEl = await findFirst(passwordSelectors);
    if (!userEl || !passEl) return { attempted: true, success: false, reason: 'fields-not-found' };

    await userEl.clear();
    await userEl.sendKeys(username);
    await passEl.clear();
    await passEl.sendKeys(password);

    // Submit via button or Enter key
    let submitEl = await findFirst(submitSelectors);
    if (submitEl) {
      await submitEl.click();
    } else {
      await passEl.sendKeys('\n');
    }

    // Wait redirect back to app
    await driver.wait(async () => {
      const current = await driver.getCurrentUrl();
      return /localhost:3000/.test(current) && !/amazoncognito\.com/.test(current);
    }, timeout);

    return { attempted: true, success: true };
  } catch (e) {
    return { attempted: true, success: false, reason: e.message };
  }
}

module.exports = { tryCognitoLogin };