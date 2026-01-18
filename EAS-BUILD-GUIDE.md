# 🚀 EAS Build Guide - AI Workout Planner

Step-by-step instructions to build and deploy your app using Expo Application Services (EAS).

---

## 📋 Prerequisites

Before you start, make sure you have:

- [ ] Node.js installed (v18 or higher)
- [ ] Expo account (create at https://expo.dev)
- [ ] EAS CLI installed globally

---

## 🔧 Step 1: Install EAS CLI

Open a terminal and run:

```bash
npm install -g eas-cli
```

Verify installation:

```bash
eas --version
```

---

## 🔐 Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials when prompted.

---

## ⚙️ Step 3: Configure Environment Variables (Important!)

Your app uses environment variables. You need to set them up in EAS:

### Option A: Using EAS Secrets (Recommended for Production)

```bash
eas secret:create --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value "your_clerk_key"
eas secret:create --name EXPO_PUBLIC_SANITY_API_TOKEN --value "your_sanity_token"
eas secret:create --name OPEN_AI_API_KEY --value "your_openai_key"
eas secret:create --name EXPO_PUBLIC_EXERCISE_DB_API_URL --value "your_exercise_db_url"
```

### Option B: Using .env file with eas.json

Add to your `eas.json` under each build profile:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY": "your_key_here",
        "EXPO_PUBLIC_SANITY_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

---

## 📱 Step 4: Build APK for Android

### For Testing (Preview Build - Faster)

```bash
eas build --platform android --profile preview
```

This creates an APK file that you can install directly on any Android device.

### For Production Release

```bash
eas build --platform android --profile production
```

---

## ⏳ Step 5: Wait for Build to Complete

- The build runs on Expo's cloud servers
- Typical build time: 10-20 minutes
- You'll see a link to track progress: `https://expo.dev/accounts/YOUR_USERNAME/projects/fit-app/builds/BUILD_ID`

---

## 📥 Step 6: Download Your APK

Once the build completes:

1. **Via CLI:**

   ```bash
   eas build:list
   ```

   Find your build and copy the download URL.

2. **Via Expo Dashboard:**
   - Go to https://expo.dev
   - Navigate to your project
   - Click on the completed build
   - Click "Download" button

---

## 📲 Step 7: Install on Android Device

1. Transfer the APK to your Android phone
2. Enable "Install from Unknown Sources" in Settings > Security
3. Open the APK file and tap "Install"

---

## 🔄 Quick Commands Reference

| Command                                                  | Description                          |
| -------------------------------------------------------- | ------------------------------------ |
| `eas build --platform android --profile preview`         | Build APK for testing                |
| `eas build --platform android --profile production`      | Build production APK                 |
| `eas build:list`                                         | List all your builds                 |
| `eas build:cancel`                                       | Cancel a running build               |
| `eas build --local --platform android --profile preview` | Build locally (requires Android SDK) |

---

## ⚠️ Common Issues & Solutions

### Issue: "Missing Android package name"

**Solution:** Already configured in your `app.json` as `com.tanvirrrr.fitapp`

### Issue: "EAS_BUILD_PROFILE environment variable not set"

**Solution:** Make sure you specify the profile: `--profile preview`

### Issue: "Secrets not found"

**Solution:** Use `eas secret:list` to verify secrets are set

### Issue: Build fails with dependency errors

**Solution:**

```bash
npx expo-doctor
npm install
eas build --platform android --profile preview --clear-cache
```

---

## 📊 Your Current Configuration

**eas.json profiles:**

- `development` - For development client builds
- `preview` - For APK testing (✅ Ready to use)
- `production` - For release APK (✅ Ready to use)

**app.json:**

- App name: `fit-app`
- Android package: `com.tanvirrrr.fitapp`
- iOS bundle: `com.tanvirrrr.fitapp`

---

## 🎯 Recommended Build Command

For quick testing, run:

```bash
cd c:\Users\itzme\OneDrive\Desktop\Projects\reactNativeProjects\AI-Workout-Planner
eas build --platform android --profile preview
```

This will build an APK optimized for internal testing and distribution.

---

## 📱 iOS Build (Optional)

For iOS, you need an Apple Developer account ($99/year):

```bash
eas build --platform ios --profile preview
```

---

## 🔗 Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Environment Variables in EAS](https://docs.expo.dev/build-reference/variables/)
- [Expo Dashboard](https://expo.dev)
- [Android APK Distribution](https://docs.expo.dev/build/internal-distribution/)
