# E2E Test Automation - Complete Test Steps

This document outlines all the steps followed during the Selenium E2E test execution for the Admin Web application.

## Test Execution Flow

### Pre-Test Setup

1. **Environment Configuration**

   - Load environment variables from `.env` file (if exists)
   - Set `BASE_URL` to `http://localhost:3000`
   - Configure headless mode (default: `true`)
   - Set global assertion library (Chai)

2. **Browser Initialization**
   - Launch Chrome browser via ChromeDriver
   - Apply Chrome options:
     - Headless mode (if enabled)
     - Window size: 1366x900
     - Disable GPU acceleration
     - Disable sandbox
     - Disable dev-shm usage
     - Disable automation control detection
   - Set timeouts:
     - Implicit wait: 2 seconds
     - Page load: 60 seconds
     - Script execution: 30 seconds
   - Register driver in global tracking (for failure screenshots)

---

## Test Suites and Steps

### 1. Login Flow Tests (`login.spec.js`)

#### Test 1.1: Shows login page and redirects to Cognito on click

**Steps:**

1. Navigate to `http://localhost:3000/login`
2. Wait for page heading (`<h2>`) to appear (max 10s)
3. **Verify:** Heading text contains "Admin Login"
4. Locate login button by ID `#loginBtn`
5. Click the login button
6. Wait for URL to contain "amazoncognito.com" (max 15s)
7. **Verify:** Current URL includes "amazoncognito.com"

**Expected Result:** ✅ User is redirected to AWS Cognito Hosted UI

---

#### Test 1.2: Can complete Cognito login when credentials provided, else injects token

**Steps:**

1. Check if `COGNITO_USERNAME` and `COGNITO_PASSWORD` environment variables are set
2. **If credentials provided:**
   - Verify current URL is on Cognito domain
   - Locate username input field (multiple selector fallbacks)
   - Locate password input field (multiple selector fallbacks)
   - Clear and enter username
   - Clear and enter password
   - Click submit button or press Enter
   - Wait for redirect back to localhost:3000 (max 30s)
   - **Verify:** Successfully redirected to dashboard
3. **If credentials NOT provided (fallback):**
   - Navigate to `/dashboard`
   - Inject test token into localStorage: `localStorage.setItem('id_token', 'test_dummy_token')`
   - Refresh the page
   - Wait for URL to contain either "dashboard" or "login" (max 10s)
4. **If on dashboard:**
   - Wait for welcome card heading (`.welcome-card h2`) to appear (max 15s)
   - **Verify:** Heading text matches pattern `/Welcome,/`

**Expected Result:** ✅ User is authenticated (real or simulated)

---

### 2. Dashboard Tests (`dashboard.spec.js`)

**Pre-Test Setup:**

1. Navigate to `/dashboard`
2. Inject test token: `localStorage.setItem('id_token', 'test_dummy_token')`
3. Refresh page

#### Test 2.1: Renders layout (navbar or error/redirect)

**Steps:**

1. Wait for URL to stabilize as "dashboard" or "login" (max 15s)
2. **If on dashboard:**
   - Wait for navigation brand (`.nav-brand h1`) to appear (max 10s)
   - **Verify:** Brand text equals "Admin Dashboard"
3. **If redirected to login:**
   - Wait for login button (`#loginBtn`) to appear (max 10s)
   - **Verify:** Button text matches pattern `/Login/`

**Expected Result:** ✅ Dashboard layout renders or gracefully redirects if backend unavailable

---

#### Test 2.2: Logout navigates back to login when visible

**Steps:**

1. Locate all logout buttons (`.btn-logout`)
2. **If logout button exists:**
   - Click the first logout button
   - Wait for URL to contain "/login" (max 10s)
   - **Verify:** User is redirected to login page

**Expected Result:** ✅ Logout functionality works (when available)

---

### 3. Admin Users Tests (`admin-users.spec.js`)

**Pre-Test Setup:**

1. Navigate to `/admin/users`
2. Inject test token: `localStorage.setItem('id_token', 'test_dummy_token')`
3. Refresh page

#### Test 3.1: Renders heading and either table or error message

**Steps:**

1. Wait for page heading (`<h2>`) to appear (max 15s)
2. **Verify:** Heading text equals "User Management"
3. Locate all tables on page
4. Locate all error messages (`.error-message`)
5. **Verify:** At least one table OR one error message exists
6. **If table exists:**
   - Locate search input (`.search-input`)
   - **Verify:** Placeholder text matches pattern `/Search/`

**Expected Result:** ✅ Admin users page renders with search or error state

---

#### Test 3.2: Allows typing in search input and preserves value

**Steps:**

1. Locate all tables on page
2. **If no table exists:** Skip this test
3. Locate search input (`.search-input`)
4. Clear the input field
5. Type "john" into the search input
6. Read the input value attribute
7. **Verify:** Input value equals "john"

**Expected Result:** ✅ Search input accepts and retains typed text

---

### 4. Profile Page Tests (`profile.spec.js`)

**Pre-Test Setup:**

1. Navigate to `/profile`
2. Inject test token: `localStorage.setItem('id_token', 'test_dummy_token')`
3. Refresh page

#### Test 4.1: Renders profile form and validates empty display name

**Steps:**

1. Wait for profile heading (`.profile-container h2`) to appear (max 15s)
2. **Verify:** Heading text equals "My Profile"
3. Locate display name input (`#displayName`)
4. Clear the display name field
5. Locate update button (`.btn-primary`)
6. Click the update button
7. Wait for validation message (`.message`) to appear (max 10s)
8. **Verify:** Message text includes "Display name cannot be empty"

**Expected Result:** ✅ Client-side validation prevents empty display name

---

#### Test 4.2: Updates fields and attempts save, shows a result message

**Steps:**

1. Locate display name input (`#displayName`)
2. Clear the field
3. Type "E2E Tester" into the field
4. Locate locale dropdown (`#locale`)
5. Press Home key to select first option (trigger change event)
6. Locate update button (`.btn-primary`)
7. Click the update button
8. Wait for result message (`.message`) to appear (max 15s)
9. **Verify:** Message text matches pattern:
   - `/Profile updated successfully!/` OR
   - `/Failed to update profile/` OR
   - `/Failed to load profile/`

**Expected Result:** ✅ Update attempt produces feedback (success or error)

---

#### Test 4.3: Back to dashboard navigates away

**Steps:**

1. Locate back button (`.btn-back`)
2. Click the back button
3. Wait for URL to contain "dashboard" or "login" (max 10s)
4. **Verify:** Navigation occurred

**Expected Result:** ✅ Back button navigates away from profile page

---

### 5. Audit Logs Tests (`audit-logs.spec.js`)

**Pre-Test Setup:**

1. Navigate to `/admin/audit-log`
2. Inject test token: `localStorage.setItem('id_token', 'test_dummy_token')`
3. Refresh page

#### Test 5.1: Renders filters and table area

**Steps:**

1. Wait for page heading (`<h2>`) to appear (max 15s)
2. **Verify:** Heading text equals "Audit Logs"
3. Locate user ID filter input (`input[name='userId']`)
4. Locate event type filter input (`input[name='eventType']`)
5. Locate date range filter input (`input[name='range']`)
6. Locate apply button (`.btn-apply`)
7. Locate reset button (`.btn-reset`)
8. Locate table element
9. **Verify:** All filter controls and table exist

**Expected Result:** ✅ Audit logs page renders with filters and table

---

#### Test 5.2: Applies filters and resets them

**Steps:**

1. Locate user ID input (`input[name='userId']`)
2. Locate event type input (`input[name='eventType']`)
3. Clear user ID input
4. Type "123" into user ID input
5. Clear event type input
6. Type "LOGIN" into event type input
7. Locate apply button (`.btn-apply`)
8. Click the apply button
9. Wait for either:
   - Error message (`.error-message`) to appear, OR
   - Table rows (`tbody tr`) to render (max 15s)
10. Locate reset button (`.btn-reset`)
11. Click the reset button
12. Wait for user ID input to re-appear (handles potential re-render, max 10s)
13. Re-locate user ID input
14. Re-locate event type input
15. **Verify:** User ID input value equals "" (empty)
16. **Verify:** Event type input value equals "" (empty)

**Expected Result:** ✅ Filters apply and reset correctly

---

## Post-Test Actions

### On Test Failure

1. Capture current page URL
2. Attach URL to Allure report as text/plain
3. Take screenshot (Base64 PNG)
4. Convert screenshot to Buffer
5. Attach screenshot to Allure report as image/png

### After Each Test

1. Check test status
2. If failed and driver(s) exist, execute failure actions above

### After All Tests

1. Quit all WebDriver instances
2. Close Chrome browsers
3. Clean up temporary files

---

## Test Execution Commands

### Standard Execution

```bash
# Run tests (headless, no reporting)
npm run test:e2e

# Run tests with Allure reporting
npm run test:e2e:allure

# Generate Allure HTML report
npm run allure:generate

# Open Allure report in browser
npm run allure:open
```

### With Server Auto-Start

```bash
# Start app and run tests
npm run e2e

# Start app and run tests with Allure
npm run e2e:allure
```

### Headed Mode (Visible Browser)

```bash
# Windows PowerShell
$env:HEADLESS="false"; npm run test:e2e

# Or use the headed script
npm run e2e:headed
```

---

## Test Artifacts

### Generated Files

- `allure-results/` - Raw Allure test results (JSON)
- `allure-report/` - HTML report with:
  - Test execution timeline
  - Pass/fail statistics
  - Screenshots on failure
  - Browser console logs (if captured)
  - Test duration and history

### Allure Report Features

- **Overview Dashboard:** Total tests, pass rate, duration
- **Test Suites:** Organized by spec file
- **Timeline:** Parallel execution visualization
- **Behaviors:** Tests grouped by feature
- **Graphs:** Trends, duration, severity distribution
- **Attachments:** Screenshots, URLs, logs on failure

---

## Test Coverage Summary

| Page/Feature | Tests  | Coverage                         |
| ------------ | ------ | -------------------------------- |
| Login Flow   | 2      | Cognito redirect, authentication |
| Dashboard    | 2      | Layout rendering, logout         |
| Admin Users  | 2      | Page load, search input          |
| Profile      | 3      | Validation, update, navigation   |
| Audit Logs   | 2      | Filters UI, apply/reset          |
| **Total**    | **11** | **Core user journeys**           |

---

## Dependencies Used

### Test Framework

- **Mocha** - Test runner and structure
- **Chai** - Assertion library (expect syntax)

### Browser Automation

- **Selenium WebDriver** - Browser control API
- **ChromeDriver** - Chrome automation driver

### Reporting

- **Allure Mocha** - Mocha reporter for Allure
- **Allure Commandline** - Report generator

### Utilities

- **dotenv** - Environment variable management
- **cross-env** - Cross-platform env vars
- **start-server-and-test** - Server lifecycle management

---

## Test Best Practices Followed

1. **Explicit Waits:** Used `driver.wait()` with specific conditions instead of implicit waits
2. **Flexible Assertions:** Tests pass whether backend is available or not
3. **Element Re-location:** Re-query DOM after interactions that may cause re-renders
4. **Error Resilience:** Graceful degradation when backend is unavailable
5. **Cleanup:** Always quit drivers in `after()` hooks
6. **Screenshots on Failure:** Automatic capture for debugging
7. **Readable Test Names:** Descriptive `it()` statements
8. **DRY Principle:** Shared driver helper and setup file
9. **Environment Flexibility:** Configurable via .env file
10. **CI/CD Ready:** Headless by default with reporting

---

## Future Enhancements (Optional)

- Add API mocking to test data-driven scenarios without backend dependency
- Implement visual regression testing (screenshot comparison)
- Add performance metrics collection
- Integrate with CI/CD pipeline (GitHub Actions, Jenkins)
- Add retry logic for flaky tests
- Capture browser console logs
- Add cross-browser testing (Firefox, Edge)
- Implement page object model for better maintainability
- Add accessibility (a11y) testing
- Generate code coverage reports

---

_Generated: November 4, 2025_
_Test Suite Version: 1.0_
_Framework: Selenium WebDriver + Mocha + Allure_
