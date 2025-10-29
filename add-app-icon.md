# Adding App Icon to Expo React Native Project

## Method 1: Using Expo's Icon Asset Generator (Recommended)

### Step 1: Install Expo CLI (if not already installed)

```bash
npm install -g @expo/cli
```

### Step 2: Generate App Icon

```bash
npx expo generate:icon
```

This will prompt you to:

- Upload an image (1024x1024px recommended)
- Choose a background color
- Generate all required icon sizes automatically

## Method 2: Manual Setup

### Step 1: Prepare Your Icon

Create a 1024x1024px icon image (PNG format). You can use tools like:

- Figma
- Adobe Photoshop
- Canva
- Online icon generators

### Step 2: Place Icon Files

Create the following directories and place your icons:

```
assets/
├── icon.png (1024x1024px - Main icon)
├── adaptive-icon.png (1024x1024px - For Android adaptive icons)
└── splash-icon.png (1024x1024px - For splash screen)
```

### Step 3: Update app.json

Add icon configuration to your `app.json`:

```json
{
  "expo": {
    "scheme": "acme",
    "userInterfaceStyle": "automatic",
    "orientation": "default",
    "web": {
      "output": "server"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://n"
        }
      ]
    ],
    "name": "fit-app",
    "slug": "fit-app",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.tanvirrrr.fitapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "ios": {
      "bundleIdentifier": "com.tanvirrrr.fitapp",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "extra": {
      "router": {
        "origin": "https://n"
      },
      "eas": {
        "projectId": "2e8d2bc4-f641-47d8-a794-4c68981e542d"
      }
    }
  }
}
```

## Icon Requirements

### For iOS:

- Sizes needed: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024px
- Format: PNG
- No transparency in the final icon

### For Android:

- Standard sizes: 48, 72, 96, 144, 192px
- Adaptive icon: 1024x1024px with foreground and background layers
- Format: PNG

### For Web:

- 512x512px recommended
- Format: PNG

## Quick Start Script

You can also use this script to automatically set up icons:

```bash
# Install expo-image-picker if you want to select from device
npx expo install expo-image-picker expo-av expo-font

# Generate icons using expo-cli
npx expo generate:icon
```

## Testing

After adding your icons:

1. Start your development server: `npx expo start`
2. Test on physical device or emulator
3. The icon will appear when you build the app for production

## Building with New Icons

To build your app with the new icons:

```bash
# Development build
eas build --profile development --platform android/ios

# Production build
eas build --profile production --platform android/ios
```
