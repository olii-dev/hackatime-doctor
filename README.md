# 🚀 Hackatime Doctor

A beginner-friendly diagnostic tool that helps you set up Hackatime for tracking your coding activity!

## 🤔 What is this?

Hackatime Doctor is like a health checkup for your development environment. It checks if everything is properly installed and configured so you can start tracking your coding time with Hackatime (a self-hosted alternative to WakaTime).

## 🏃‍♂️ Quick Start

### Option 1: Simple command
```bash
node doctor.mjs
```

### Option 2: Using npm scripts (even easier!)
```bash
npm run doctor
# or
npm run checkup
# or  
npm run help
```

## 📋 What does it check?

The doctor will check these 8 important things:

1. **Git** - Version control system for your code
2. **Node.js** - JavaScript runtime for your computer  
3. **package.json** - Your project configuration file
4. **Dependencies** - Required code libraries
5. **src/ folder** - Where your source code lives
6. **.env file** - Your API keys and settings
7. **README.md** - Documentation for your project
8. **API Connection** - Can we connect to your Hackatime server?

## 🆘 First time using this?

Don't worry! Here's what to do:

1. **Open your terminal/command prompt**
   - On Mac: Press `Cmd + Space`, type "Terminal"
   - On Windows: Press `Win + R`, type "cmd"
   - In VS Code: Press `Ctrl + \`` (backtick)

2. **Navigate to this project folder**
   ```bash
   cd path/to/hackatime-doc
   ```

3. **Run the doctor**
   ```bash
   node doctor.mjs
   ```

4. **Follow the suggestions!**
   - The tool will show you exactly what to fix
   - Copy and paste the suggested commands
   - Run the doctor again to see your progress

## 🔧 Common fixes

### "Git is not installed"
```bash
# Visit https://git-scm.com/downloads and install Git
# Or on Mac with Homebrew:
brew install git
```

### "Node.js is not installed"
```bash
# Visit https://nodejs.org/ and download the LTS version
```

### "package.json not found"
```bash
npm init -y
```

### "Dependencies not installed"
```bash
npm install
```

### "src/ folder missing"
```bash
mkdir src
```

### ".env file missing"
Create a file called `.env` in your project root:
```env
HACKATIME_API_KEY=your_api_key_here
HACKATIME_API_URL=https://your-hackatime-server.com
```

## 🎯 What's next?

Once all checks pass:

1. Install the Hackatime extension in your code editor
2. Start coding and watch your stats grow!
3. Check your Hackatime dashboard to see your activity

## 🤝 Need help?

- **Node.js Tutorial**: https://nodejs.org/en/learn
- **Git Tutorial**: https://learngitbranching.js.org/
- **VS Code Tutorial**: https://code.visualstudio.com/docs

## 🔄 Running again

You can run this tool as many times as you want! It's especially helpful to run it again after fixing issues to make sure everything is working.

---

Happy coding! 🎉
