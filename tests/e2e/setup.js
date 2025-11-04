require('dotenv').config();
const chai = require('chai');
chai.config.truncateThreshold = 0;

// Base URL for app
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Global helpers for specs
global.expect = chai.expect;