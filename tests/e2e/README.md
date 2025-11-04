# E2E Test Automation

This project includes comprehensive end-to-end (E2E) tests using Selenium WebDriver to test the React frontend with AWS Cognito authentication.

## Prerequisites

- Node.js installed
- Chrome browser installed
- Backend server running on `http://localhost:8080` (optional, tests will handle gracefully if not available)

## Setup

1. Install dependencies:

```bash
npm install
```

2. (Optional) Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. (Optional) Configure Cognito test credentials in `.env`:

```env
COGNITO_USERNAME=your_test_user@example.com
COGNITO_PASSWORD=YourTestPassword123
```

## Running Tests

### Option 1: Run tests with auto-started server (Recommended)

```bash
npm run e2e
```

This will:

- Start the React dev server
- Wait for it to be ready
- Run all E2E tests
- Clean up afterwards

### Option 2: Run tests with headed browser (see what's happening)

```bash
npm run e2e:headed
```

### Option 3: Run tests manually (server must be running)

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Run tests
npm run test:e2e
```

## Test Coverage

### 1. Login Tests (`tests/e2e/login.spec.js`)

- ✅ Login page renders correctly
- ✅ Login button redirects to AWS Cognito
- ✅ Cognito authentication (if credentials provided)
- ✅ Token simulation fallback

### 2. Dashboard Tests (`tests/e2e/dashboard.spec.js`)

- ✅ Dashboard layout renders
- ✅ Navigation bar displays
- ✅ Logout functionality works

### 3. Admin Users Tests (`tests/e2e/admin-users.spec.js`)

- ✅ User management page renders
- ✅ Search functionality present
- ✅ User table displays (when backend available)

## Test Structure

```
tests/e2e/
├── setup.js                 # Global test configuration
├── helpers/
│   ├── driver.js           # WebDriver setup and configuration
│   └── cognito.js          # AWS Cognito login helper
├── login.spec.js           # Login flow tests
├── dashboard.spec.js       # Dashboard tests
└── admin-users.spec.js     # Admin users page tests
```

## Configuration

### Environment Variables

- `BASE_URL` - Frontend URL (default: http://localhost:3000)
- `COGNITO_USERNAME` - Test user email (optional)
- `COGNITO_PASSWORD` - Test user password (optional)
- `HEADLESS` - Run browser in headless mode (default: true)

### Timeouts

- Test timeout: 90 seconds
- Page load: 60 seconds
- Element wait: 15 seconds

## Troubleshooting

### ChromeDriver version mismatch

If you see errors about Chrome version mismatch:

```bash
npm install chromedriver@latest --save-dev
```

### Tests timing out

- Ensure the frontend server is running on port 3000
- Check if backend is accessible (tests work without it, but with limited functionality)
- Try running in headed mode to see what's happening: `npm run e2e:headed`

### Port already in use

If port 3000 is already in use, use Option 3 above to run tests manually.

## CI/CD Integration

Tests run in headless mode by default, making them suitable for CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install

- name: Run E2E tests
  run: npm run test:e2e
```

## Notes

- Tests use token simulation when Cognito credentials are not provided
- Backend API calls are handled gracefully (tests pass even if backend is down)
- All tests use explicit waits for better reliability
- ChromeDriver is automatically managed by the project
