#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const envPath = path.resolve(process.cwd(), '.env');

// Welcome message for beginners
function showWelcome() {
  console.log(chalk.cyan.bold('\n🚀 Welcome to Hackatime Doctor!'));
  console.log(chalk.cyan('This tool will help you set up Hackatime to track your coding activity.'));
  console.log(chalk.cyan('Don\'t worry if you\'re new to this - we\'ll guide you through everything!\n'));
}

function check(name, passed, help = '', moreInfo = '') {
  if (passed) {
    console.log(chalk.green('✅'), chalk.green(name));
  } else {
    console.log(chalk.red('❌'), chalk.red(name));
    if (help) {
      console.log('   ', chalk.yellow('💡 How to fix:'), chalk.yellow(help));
    }
    if (moreInfo) {
      console.log('   ', chalk.blue('ℹ️  More info:'), chalk.blue(moreInfo));
    }
  }
}

function showProgress(step, total) {
  console.log(chalk.magenta(`\n📋 Check ${step}/${total}:`));
}

function checkCmdExists(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function checkApiKey() {
  if (!fs.existsSync(envPath)) {
    check(
      'API Configuration Found', 
      false, 
      'Create a .env file in your project root with HACKATIME_API_KEY and HACKATIME_API_URL',
      'The .env file stores your secret API credentials. It should look like:\nHACKATIME_API_KEY=your_key_here\nHACKATIME_API_URL=https://your-hackatime-server.com'
    );
    return;
  }
  
  const apiKey = process.env.HACKATIME_API_KEY;
  const apiUrl = process.env.HACKATIME_API_URL;

  if (!apiKey || !apiUrl) {
    check(
      'API Configuration Complete', 
      false, 
      'Add both HACKATIME_API_KEY and HACKATIME_API_URL to your .env file',
      'Get your API key from your Hackatime server\'s settings page'
    );
    return;
  }

  console.log('   ', chalk.blue('🔍 Testing connection to Hackatime server...'));
  
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const response = await fetch(`${apiUrl}/heartbeat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        branch: 'master',
        category: 'coding',
        cursorpos: 1,
        entity: 'welcome.txt',
        type: 'file',
        lineno: 1,
        lines: 1,
        project: 'welcome',
        time: currentTime,
        user_agent: 'wakatime/v1.102.1',
      }),
    });

    if (response.ok) {
      check('API Connection Working', true);
      console.log('   ', chalk.green('🎉 Successfully connected to your Hackatime server!'));
    } else {
      check(
        'API Connection Working', 
        false, 
        `Server responded with error ${response.status}. Check if your API key is correct`,
        'Double-check your HACKATIME_API_KEY and HACKATIME_API_URL in the .env file'
      );
    }
  } catch (err) {
    check(
      'API Connection Working', 
      false, 
      `Cannot reach server: ${err.message}`,
      'Make sure your HACKATIME_API_URL is correct and the server is running'
    );
  }
}

async function main() {
  showWelcome();
  
  console.log(chalk.blueBright.bold('� Running System Checkup...\n'));

  const totalChecks = 8;
  let currentCheck = 1;

  // Check 1: Git
  showProgress(currentCheck++, totalChecks);
  const gitInstalled = checkCmdExists('git');
  check(
    'Git is installed', 
    gitInstalled, 
    'Download and install Git from https://git-scm.com/downloads',
    'Git helps you track changes in your code and collaborate with others'
  );

  // Check 2: Node.js
  showProgress(currentCheck++, totalChecks);
  const nodeInstalled = checkCmdExists('node');
  check(
    'Node.js is installed', 
    nodeInstalled, 
    'Download and install Node.js from https://nodejs.org/',
    'Node.js lets you run JavaScript on your computer (not just in browsers)'
  );

  // Check 3: Package.json
  showProgress(currentCheck++, totalChecks);
  const packageJsonExists = fs.existsSync('package.json');
  check(
    'Project configuration found (package.json)', 
    packageJsonExists, 
    'Run "npm init -y" in your terminal to create a package.json file',
    'package.json tells Node.js about your project and its dependencies'
  );

  // Check 4: Dependencies installed
  showProgress(currentCheck++, totalChecks);
  const nodeModulesExists = fs.existsSync('node_modules');
  check(
    'Project dependencies installed', 
    nodeModulesExists, 
    'Run "npm install" in your terminal to install required packages',
    'This downloads all the code libraries your project needs'
  );

  // Check 5: Source folder
  showProgress(currentCheck++, totalChecks);
  const srcExists = fs.existsSync('src');
  check(
    'Source code folder exists (src/)', 
    srcExists, 
    'Create a "src" folder for your source code: mkdir src',
    'The src folder is where you\'ll write your main application code'
  );

  // Check 6: Environment file
  showProgress(currentCheck++, totalChecks);
  const envExists = fs.existsSync('.env');
  const envExampleExists = fs.existsSync('.env.example');
  const envHelp = envExampleExists 
    ? 'Copy .env.example to .env and fill in your API credentials: cp .env.example .env'
    : 'Create a .env file to store your API keys and settings';
  
  check(
    'Environment configuration exists (.env)', 
    envExists, 
    envHelp,
    'The .env file keeps sensitive information like passwords and API keys safe'
  );

  // Check 7: Documentation
  showProgress(currentCheck++, totalChecks);
  const readmeExists = fs.existsSync('README.md');
  check(
    'Project documentation exists (README.md)', 
    readmeExists, 
    'Create a README.md file to describe your project',
    'A good README helps others (and future you!) understand what your project does'
  );

  // Check 8: API Connection
  showProgress(currentCheck++, totalChecks);
  await checkApiKey();

  // Summary
  console.log(chalk.magenta('\n📊 Checkup Results:\n'));

  const checks = [
    gitInstalled,
    nodeInstalled,
    packageJsonExists,
    nodeModulesExists,
    srcExists,
    envExists,
    readmeExists,
    process.env.HACKATIME_API_KEY && process.env.HACKATIME_API_URL,
  ];

  const passedChecks = checks.filter(Boolean).length;
  const failedChecks = totalChecks - passedChecks;

  if (failedChecks === 0) {
    console.log(chalk.green.bold('🎉 Congratulations! Your Hackatime setup is complete!'));
    console.log(chalk.green('   All checks passed. You\'re ready to start tracking your coding activity!'));
    console.log(chalk.cyan('\n💡 Next steps:'));
    console.log(chalk.cyan('   • Install the Hackatime extension in your code editor'));
    console.log(chalk.cyan('   • Start coding and watch your stats grow!'));
    console.log(chalk.cyan('   • Check your dashboard to see your coding activity'));
  } else if (failedChecks <= 2) {
    console.log(chalk.yellow.bold('⚠️  Almost there! Just a few more steps.'));
    console.log(chalk.yellow(`   ${passedChecks}/${totalChecks} checks passed. Fix the issues above and run this tool again.`));
  } else {
    console.log(chalk.red.bold('❌ Several setup steps are missing.'));
    console.log(chalk.red(`   ${passedChecks}/${totalChecks} checks passed. Don't worry - follow the guidance above!`));
    console.log(chalk.cyan('\n🆘 Need help? Here are some beginner-friendly resources:'));
    console.log(chalk.cyan('   • Node.js Tutorial: https://nodejs.org/en/learn'));
    console.log(chalk.cyan('   • Git Tutorial: https://learngitbranching.js.org/'));
    console.log(chalk.cyan('   • VS Code Tutorial: https://code.visualstudio.com/docs'));
  }

  console.log(chalk.blue('\n Run this checkup again anytime with: node doctor.mjs'));
  console.log(chalk.blue('💬 Tip: If you get stuck, try running the suggested commands one at a time!'));
}

main();
