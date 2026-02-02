# Divine Timing - Muhurat App 🌟

A premium web application for finding auspicious times (Muhurat) based on Vedic Astrology. Built with Next.js, exact astronomical calculations, and Google Calendar integration.

## Features

- **🎯 Activity-Based**: Find the best time for Marriage, Travel, Business, and more.
- **📍 Smart Location**: Calculates sunrise/sunset and planetary positions based on your exact coordinates.
- **📅 Google Calendar Sync**: Block inauspicious times (Rahu Kalam, Yamagandam) directly on your calendar with one click.
- **✨ Premium Design**: Modern, glassmorphism-inspired UI with a deep cosmic theme.

## Live Demo

👉 **[Launch App](https://gvvvinay.github.io/muhurat-app/)**

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16
- **Styling**: CSS Modules & Variables
- **Calculations**: `suncalc`, `astronomy-engine`
- **Auth**: Google OAuth 2.0 (for Calendar access)

## Getting Started

1. **Clone the repo**:
   ```bash
   git clone https://github.com/gvvvinay/muhurat-app.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment**:
   Create a `.env.local` file and add your Google Client ID:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Calendar Integration
To enable the "Block in Calendar" feature, you must configure a project in the [Google Cloud Console](https://console.cloud.google.com/) and whitelist your origin (e.g., `http://localhost:3000` or your GitHub Pages URL).
