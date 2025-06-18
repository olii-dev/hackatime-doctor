#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Needed to emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

console.log(chalk.blueBright.bold('\n👨‍⚕️ Hackatime Doctor - System Checkup\n'));

let allPassed = true;

function check(title, passed, message = '') {
  if (passed) {
    console.log(chalk.green(`✅ ${title}`));
  } else {
    console.log(chalk.red(`❌ ${title}`));
    if (message) console.log(chalk.yellow('   ' + message));
    allPassed = false;
  }
}

try {
  const gitVersion = execSync('git --version').toString().trim();
  check('Git Installed', true, gitVersion);
} catch {
  check('Git Installed', false, 'Install Git: https://git-scm.com/downloads');
}

const nodeVersion = process.version;
const major = parseInt(nodeVersion.replace('v', '').split('.')[0]);
check('Node.js Installed', true, `Version ${nodeVersion}`);
if (major < 18) {
  console.log(chalk.yellow('   Consider upgrading to Node 18+ for best results.'));
}

check(
  'package.json present',
  fs.existsSync(path.join(__dirname, 'package.json')),
  'Run `npm init` to create one.'
);

check(
  'node_modules folder present',
  fs.existsSync(path.join(__dirname, 'node_modules')),
  'Run `npm install` to install dependencies.'
);

const expectedItems = ['src', '.env', 'README.md'];
expectedItems.forEach((item) => {
  const exists = fs.existsSync(path.join(__dirname, item));
  check(`${item} exists`, exists, `Missing ${item}. Did you set up the project?`);
});

if (fs.existsSync(path.join(__dirname, '.env'))) {
  const token = process.env.HACKATIME_API_TOKEN;
  const valid = token && token.startsWith('ht_') && token.length > 15;
  check('API Token Valid', valid, 'Check that your .env file has HACKATIME_API_TOKEN=ht_...');
} else {
  check('.env file found', false, 'Create a .env file and add your HACKATIME_API_TOKEN.');
}

console.log('\n' + (allPassed
  ? chalk.green.bold('✅ All checks passed! You\'re good to go.')
  : chalk.red.bold('⚠️ Some checks failed. See above for help.')));

console.log(chalk.cyan('\n📘 Tip: Open VS Code terminal with Ctrl+` (backtick) or from Terminal > New Terminal'));
console.log(chalk.cyan('📘 Run this tool again anytime with: ') + chalk.yellow('node doctor.mjs\n'));
