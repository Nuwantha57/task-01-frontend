# OWASP ZAP Security Scan Guide - Frontend Application

## Overview

This guide provides step-by-step instructions for performing security scanning on the React frontend application using OWASP ZAP (Zed Attack Proxy).

## Prerequisites

- Node.js and npm installed
- Your React application running locally
- OWASP ZAP installed

---

## Part 1: Installation and Setup

### Step 1: Install OWASP ZAP

#### Option A: Windows Installer (Recommended)

1. Visit [OWASP ZAP Download Page](https://www.zaproxy.org/download/)
2. Download the Windows Installer (`ZAP_2_15_0_windows.exe` or latest)
3. Run the installer with administrator privileges
4. Follow the installation wizard
5. Launch OWASP ZAP from Start Menu

#### Option B: Cross-Platform Package

1. Download the cross-platform ZIP package
2. Requires Java 11 or higher installed
3. Extract and run `zap.bat` (Windows) or `zap.sh` (Linux/Mac)

### Step 2: Initial ZAP Configuration

1. **First Launch:**

   - Open OWASP ZAP
   - Choose session persistence option (recommend "No, I do not want to persist this session")
   - The ZAP interface will open with multiple panels

2. **Update ZAP (Important):**

   - Go to `Help` → `Check for Updates`
   - Install any available updates
   - Restart ZAP if prompted

3. **Configure Marketplace:**
   - Go to `Manage Add-ons` (puzzle icon in toolbar)
   - Go to `Marketplace` tab
   - Install recommended add-ons:
     - **Active Scan Rules - beta**
     - **Passive Scan Rules - beta**
     - **Ajax Spider**
     - **Export Report**

---

## Part 2: Prepare Your Application

### Step 1: Start Your React Application

```powershell
# Navigate to your project directory
cd C:\Intern_Project_Code\task-01-frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

Your application should be running at: `http://localhost:3000`

### Step 2: Verify Application is Running

- Open browser and navigate to `http://localhost:3000`
- Ensure the application loads correctly
- Test basic navigation and functionality

---

## Part 3: Configure OWASP ZAP

### Method 1: Automated Scan (Quick & Easy)

This is the fastest way to get started and suitable for initial security assessment.

#### Step 1: Configure Automated Scan

1. In OWASP ZAP, go to the **Quick Start** tab
2. Under "Automated Scan", enter your URL:
   ```
   http://localhost:3000
   ```
3. Click **"Attack"** button

4. **Configure Attack Options (Optional):**
   - Check "Use traditional spider" (for better coverage)
   - Check "Use ajax spider" (important for React apps!)
   - Leave other options as default for first scan

#### Step 2: Monitor the Scan

1. ZAP will perform multiple phases:

   - **Spider/Crawl Phase**: Discovers all pages and endpoints (5-15 mins)
   - **Active Scan Phase**: Tests for vulnerabilities (10-30 mins)

2. Monitor progress in the bottom panel:

   - Watch the progress bars
   - Review discovered URLs in the "Sites" tree

3. **Wait for Completion:**
   - The scan can take 15-60 minutes depending on app size
   - You'll see "Attack complete" message when done

---

### Method 2: Manual Explore + Active Scan (Recommended for Better Coverage)

This method provides more comprehensive results by manually exploring the application first.

#### Step 1: Set Up ZAP as Proxy

1. **Configure ZAP Proxy:**

   - ZAP runs a proxy on `localhost:8080` by default
   - Go to `Tools` → `Options` → `Local Proxies`
   - Verify address: `localhost` and port: `8080`

2. **Configure Browser to Use ZAP Proxy:**

   **Option A: Use Firefox (Easiest)**

   - Download and install Firefox
   - In ZAP, click the Firefox icon in the toolbar
   - ZAP will launch Firefox pre-configured with the proxy

   **Option B: Configure Chrome/Edge Manually**

   - Download FoxyProxy extension for your browser
   - Add new proxy: `127.0.0.1:8080`
   - Enable the proxy

#### Step 2: Manual Exploration (HUD Mode - Recommended)

1. **Enable HUD (Heads Up Display):**

   - In ZAP, go to `Tools` → `Options` → `HUD`
   - Check "Enable HUD"
   - Click OK

2. **Launch Browser with HUD:**

   - Click the browser icon with "HUD" in ZAP toolbar
   - Navigate to `http://localhost:3000`
   - You'll see HUD overlay on your application

3. **Explore Your Application:**

   - Click through all pages and features:
     - Login page
     - Dashboard
     - User Profile
     - Admin Users
     - Audit Logs
   - Fill out and submit forms
   - Click all buttons and links
   - Perform typical user workflows
   - **Important:** Perform authentication if required

4. **Monitor in ZAP:**
   - Watch the "Sites" tree populate with discovered URLs
   - Check the "History" tab to see all requests

#### Step 3: Run Spider (Automated Discovery)

1. In the "Sites" tree, right-click on `http://localhost:3000`
2. Select `Attack` → `Spider`
3. In the Spider dialog:
   - Check "recurse" option
   - Set max depth: 5-10
   - Click "Start Scan"
4. Wait for spider to complete (usually 5-15 minutes)

#### Step 4: Run Ajax Spider (Critical for React!)

Since this is a React app, the Ajax Spider is essential for discovering dynamic content.

1. Right-click on `http://localhost:3000` in Sites tree
2. Select `Attack` → `Ajax Spider`
3. Configure settings:
   - Browser: Chrome or Firefox
   - Max duration: 10 minutes (adjust based on app size)
   - Click "Start Scan"
4. Watch the Ajax Spider discover dynamic routes and content

#### Step 5: Run Active Scan

1. After manual exploration and spidering, right-click on `http://localhost:3000`
2. Select `Attack` → `Active Scan`
3. Configure Active Scan:

   - **Recurse:** Check this box
   - **Show advanced options:** Click to expand
   - **Policy:** Default Policy (or create custom)
   - Click "Start Scan"

4. **Active Scan Progress:**
   - This is the most time-consuming phase (20-60 minutes)
   - Monitor progress in bottom panel
   - You can pause/resume if needed

---

## Part 4: Review Results

### Step 1: View Alerts

1. Go to the **Alerts** tab (bottom panel)
2. Alerts are categorized by severity:
   - 🔴 **High** - Critical vulnerabilities
   - 🟠 **Medium** - Significant security issues
   - 🟡 **Low** - Minor security concerns
   - 🔵 **Informational** - Best practice recommendations

### Step 2: Analyze Individual Alerts

For each alert:

1. Click on the alert to view details:
   - **Description:** What the vulnerability is
   - **URL:** Where it was found
   - **Risk:** Severity level
   - **Solution:** How to fix it
   - **Reference:** Links to more information
   - **CWE ID/WASC ID:** Standard vulnerability identifiers

### Step 3: Common Frontend Vulnerabilities to Look For

- **Cross-Site Scripting (XSS)**
- **Missing Security Headers** (CSP, X-Frame-Options, etc.)
- **Cookie Security Issues** (missing HttpOnly, Secure flags)
- **Information Disclosure**
- **Clickjacking**
- **Insecure Content (Mixed Content)**

---

## Part 5: Generate Reports

### Option 1: HTML Report (Recommended)

1. Go to `Report` → `Generate HTML Report`
2. Choose a location to save (e.g., `C:\Intern_Project_Code\task-01-frontend\security-reports\`)
3. Filename: `zap-scan-report-2025-11-04.html`
4. Click Save
5. Open the HTML file in a browser to review

### Option 2: JSON Report (For Automation/CI/CD)

1. Go to `Report` → `Generate JSON Report`
2. Save as `zap-scan-report.json`

### Option 3: XML Report

1. Go to `Report` → `Generate XML Report`
2. Save as `zap-scan-report.xml`

### Option 4: Markdown Report

1. Install "Report Generation" add-on if not already installed
2. Go to `Report` → `Generate MD Report`
3. Save as `zap-scan-report.md`

---

## Part 6: Common Issues and Solutions for React Apps

### Issue 1: ZAP Doesn't Discover All Routes

**Solution:**

- Use Ajax Spider (essential for SPAs)
- Manually navigate to all routes before scanning
- Use HUD mode for better interaction
- Check React Router routes and manually visit them

### Issue 2: False Positives

**Solution:**

- Review each alert carefully
- Test manually to verify
- Use "Mark as False Positive" in ZAP for confirmed false positives
- Document your findings

### Issue 3: Authentication Required

**Solution:**

- Manually log in through ZAP's browser
- Set up session management in ZAP:
  - `Tools` → `Options` → `Session Management`
  - Configure authentication credentials
  - Set up session handling rules

### Issue 4: CORS Errors

**Solution:**

- This is expected when ZAP intercepts requests
- Ignore CORS errors during scanning
- They won't affect scan results

---

## Part 7: Quick Scan Checklist

### Before Scanning:

- [ ] OWASP ZAP installed and updated
- [ ] Application running on `http://localhost:3000`
- [ ] ZAP add-ons installed (Ajax Spider, Active Scan Rules)

### During Scanning:

- [ ] Run traditional spider
- [ ] Run Ajax spider (important for React!)
- [ ] Manually explore all features
- [ ] Perform user authentication flows
- [ ] Run active scan
- [ ] Monitor for errors or issues

### After Scanning:

- [ ] Review all High and Medium alerts
- [ ] Generate HTML report
- [ ] Document findings
- [ ] Create remediation plan
- [ ] Fix vulnerabilities
- [ ] Re-scan to verify fixes

---

## Part 8: Automated Scanning with ZAP API (Advanced)

For CI/CD integration, you can automate ZAP scanning:

### Install ZAP API Client

```powershell
npm install --save-dev zaproxy
```

### Create Automation Script

Create file: `security-scan.js`

```javascript
const ZapClient = require("zaproxy");

const zapOptions = {
  apiKey: "your-api-key-here", // Generate in ZAP: Tools → Options → API
  proxy: {
    host: "localhost",
    port: 8080,
  },
};

const zap = new ZapClient(zapOptions);
const target = "http://localhost:3000";

async function runScan() {
  try {
    console.log("Starting ZAP scan...");

    // Start spider
    const spiderScanId = await zap.spider.scan(target);
    console.log("Spider started:", spiderScanId);

    // Wait for spider to complete
    while (parseInt(await zap.spider.status(spiderScanId)) < 100) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const progress = await zap.spider.status(spiderScanId);
      console.log("Spider progress:", progress + "%");
    }

    // Start active scan
    const activeScanId = await zap.ascan.scan(target);
    console.log("Active scan started:", activeScanId);

    // Wait for active scan to complete
    while (parseInt(await zap.ascan.status(activeScanId)) < 100) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const progress = await zap.ascan.status(activeScanId);
      console.log("Active scan progress:", progress + "%");
    }

    // Get alerts
    const alerts = await zap.core.alerts(target);
    console.log("Scan complete! Found", alerts.length, "alerts");

    // Generate report
    const htmlReport = await zap.core.htmlreport();
    require("fs").writeFileSync("zap-report.html", htmlReport);
    console.log("Report saved to zap-report.html");
  } catch (error) {
    console.error("Scan failed:", error);
  }
}

runScan();
```

### Add to package.json

Add script to run automated scan:

```json
"scripts": {
  "security:scan": "node security-scan.js"
}
```

---

## Part 9: Integration with CI/CD

### GitHub Actions Example

Create `.github/workflows/security-scan.yml`:

```yaml
name: OWASP ZAP Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  zap_scan:
    runs-on: ubuntu-latest
    name: Security Scan
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm start &

      - name: Wait for app to start
        run: sleep 10

      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: "http://localhost:3000"
          rules_file_name: ".zap/rules.tsv"
          cmd_options: "-a"

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v2
        with:
          name: zap-report
          path: report_html.html
```

---

## Part 10: Recommended Security Headers for React Apps

Add these to your application to fix common findings:

### Using React Helmet for Security Headers

```bash
npm install react-helmet
```

### In your App.js:

```javascript
import { Helmet } from "react-helmet";

function App() {
  return (
    <>
      <Helmet>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="Referrer-Policy" content="no-referrer" />
        <meta
          http-equiv="Permissions-Policy"
          content="geolocation=(), microphone=(), camera=()"
        />
      </Helmet>
      {/* Your app components */}
    </>
  );
}
```

### Or Configure in public/index.html:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
/>
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="Referrer-Policy" content="no-referrer" />
```

---

## Summary

### Quick Start Commands:

```powershell
# 1. Start your application
npm start

# 2. Open OWASP ZAP and run automated scan on:
# http://localhost:3000

# 3. After scan completes, generate report
# Report → Generate HTML Report
```

### Expected Timeline:

- **Setup:** 15-30 minutes (first time)
- **Manual exploration:** 10-20 minutes
- **Spider scan:** 5-15 minutes
- **Ajax spider:** 5-10 minutes
- **Active scan:** 20-60 minutes
- **Review & report:** 15-30 minutes

**Total:** 1.5 - 3 hours for comprehensive scan

### Next Steps:

1. Review all High and Medium severity alerts
2. Implement security fixes
3. Re-scan to verify fixes
4. Document remediation efforts
5. Schedule regular security scans

---

## Additional Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ZAP API Documentation](https://www.zaproxy.org/docs/api/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

---

## Support

For issues or questions:

- OWASP ZAP User Group: https://groups.google.com/group/zaproxy-users
- OWASP ZAP GitHub: https://github.com/zaproxy/zaproxy

---

**Last Updated:** November 4, 2025
