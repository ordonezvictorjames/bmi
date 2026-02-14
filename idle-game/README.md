# Cookie Empire - Idle Clicker Game

A simple but addictive idle clicker game built with HTML5, CSS3, and JavaScript. Build your cookie empire by clicking cookies and purchasing upgrades!

## Features

- 🍪 Click cookies to earn points
- 🏪 Purchase upgrades that generate cookies automatically
- 💾 Auto-save progress to localStorage
- 📱 Mobile-optimized touch controls
- ⏰ Offline progress calculation
- 🎨 Beautiful gradient UI design

## Game Mechanics

### Upgrades Available:
- **Cursor** (👆) - Auto-clicks for you (0.1 CPS)
- **Grandma** (👵) - Bakes cookies for you (1 CPS)
- **Farm** (🚜) - Grows cookie ingredients (8 CPS)
- **Mine** (⛏️) - Mines chocolate chips (47 CPS)
- **Factory** (🏭) - Mass produces cookies (260 CPS)

### Progression System:
- Upgrade costs increase by 15% each time you buy one
- Cookies per second (CPS) accumulates from all owned upgrades
- Offline earnings calculated when you return (max 1 hour)

## Development Setup

### Option 1: Web Browser (Testing)
1. Install a local server:
   ```bash
   npm install -g http-server
   ```
2. Run the game:
   ```bash
   cd idle-game
   http-server . -p 8080
   ```
3. Open http://localhost:8080 in your browser

### Option 2: Android App (Cordova)

#### Prerequisites:
- Node.js and npm installed
- Android Studio with SDK
- Cordova CLI: `npm install -g cordova`

#### Setup:
1. Initialize Cordova project:
   ```bash
   cd idle-game
   cordova platform add android
   ```

2. Build for Android:
   ```bash
   cordova build android
   ```

3. Run on device/emulator:
   ```bash
   cordova run android
   ```

#### Alternative: Capacitor Setup
If you prefer Capacitor over Cordova:

1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. Initialize:
   ```bash
   npx cap init "Cookie Empire" "com.example.idlegame"
   ```

3. Add Android platform:
   ```bash
   npx cap add android
   ```

4. Build and sync:
   ```bash
   npx cap sync android
   npx cap open android
   ```

## File Structure

```
idle-game/
├── index.html          # Main game HTML
├── styles.css          # Game styling
├── game.js            # Game logic and mechanics
├── config.xml         # Cordova configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## Customization Ideas

### Easy Modifications:
- Change cookie emoji to different items (🍕, 🍰, 💎)
- Adjust upgrade costs and CPS values
- Add new upgrade types
- Modify color scheme in CSS

### Advanced Features to Add:
- Achievement system
- Prestige/rebirth mechanics
- Multiple currencies
- Mini-games
- Sound effects
- Particle effects on clicks
- Cloud save functionality

## Publishing to Google Play

1. Build a signed APK:
   ```bash
   cordova build android --release
   ```

2. Sign the APK with your keystore
3. Upload to Google Play Console
4. Follow Google Play's publishing guidelines

## License

MIT License - Feel free to modify and distribute!