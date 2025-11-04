require('dotenv').config();
const chai = require('chai');
chai.config.truncateThreshold = 0;
const { allure } = require('allure-mocha/runtime');

// Base URL for app
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Global helpers for specs
global.expect = chai.expect;

// Global afterEach to attach screenshots and context on failure
afterEach(async function() {
	if (this.currentTest && this.currentTest.state === 'failed' && global.__drivers) {
		for (const d of global.__drivers) {
			try {
				const url = await d.getCurrentUrl().catch(() => 'unknown');
				allure.attachment('Current URL', url || 'unknown', 'text/plain');

				const png = await d.takeScreenshot();
				const buffer = Buffer.from(png, 'base64');
				allure.attachment('Screenshot', buffer, 'image/png');
			} catch (_) {}
		}
	}
});