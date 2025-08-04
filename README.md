# AI-Workout-Planner 💪

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/tanbiralam/AI-Workout-Planner/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/fit-app.svg)](https://www.npmjs.com/package/fit-app)
[![Build Status](https://github.com/tanbiralam/AI-Workout-Planner/actions/workflows/ci.yml/badge.svg)](https://github.com/tanbiralam/AI-Workout-Planner/actions/workflows/ci.yml)

AI-Workout-Planner is a smart fitness app built with Expo and Tailwind CSS that generates personalized workout plans using AI. It helps users optimize their training routines with intuitive navigation and seamless multi-platform support.

## ✨ Features

- AI-powered personalized workout plan generation  
- Cross-platform support: iOS, Android, and Web  
- User authentication with Clerk integration  
- Responsive UI styled with Nativewind (Tailwind CSS for React Native)  
- Secure data storage using Expo Secure Store  
- Easy deep linking and navigation with Expo Router  
- Smooth animations with React Native Reanimated  

## 🚀 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/tanbiralam/AI-Workout-Planner.git
   cd AI-Workout-Planner
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create and configure your `.env` file based on `.env.example`.
4. Start the development server:
   ```sh
   npm run start
   ```
5. To run on a specific platform:
   - Android:
     ```sh
     npm run android
     ```
   - iOS:
     ```sh
     npm run ios
     ```
   - Web:
     ```sh
     npm run web
     ```

## 💻 Usage

After launching the app, create an account or sign in using the built-in authentication. Input your fitness goals, preferences, and current fitness level. The AI engine will generate a customized workout plan tailored to your needs.

Navigate through workout days, track progress, and update your preferences anytime. The app syncs across devices, ensuring your plan is always accessible.

For deployment, use the provided deploy script to publish your web app or mobile builds via Expo Application Services:

```sh
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements or bug fixes. For major changes, open an issue first to discuss your approach.

Ensure your code follows the existing style and runs successfully with proper error handling.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/tanbiralam/AI-Workout-Planner/blob/main/LICENSE) file for details.

---

# `.env.example`

```env
# API key for AI workout generation service
AI_WORKOUT_API_KEY=your_api_key_here
# Obtain your API key at: https://example.com/api-keys

# Clerk authentication frontend API key
CLERK_FRONTEND_API=your_clerk_frontend_api_key
# Sign up for Clerk at https://clerk.com

# Secure storage encryption key (keep this secret!)
SECURE_STORE_KEY=your_secure_store_key_here

# Database connection string (example for PostgreSQL)
DATABASE_URL=postgres://username:password@hostname:5432/database_name

# Expo environment variables
EXPO_PUBLIC_BASE_URL=https://yourdomain.com
```

*Note: Never commit your actual `.env` file with sensitive data to version control.*