# Rork App

A modern, feature-rich mobile and web application built with Expo and React Native.

## Features

- 📱 Cross-platform support (iOS, Android, Web)
- 🎨 Modern UI with custom widgets
- 🌙 Automatic dark/light mode
- 📊 Dashboard customization
- 🔄 Real-time updates
- 📍 Location services
- 📱 Native gestures and animations
- 🔐 Authentication system
- 📈 Multiple widget types:
  - Clock
  - Email
  - Health
  - Links
  - News
  - Notes
  - Quotes
  - Reddit
  - Social Feed
  - Stocks
  - Tasks
  - Weather

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rork_app.git
cd rork_app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
# For local development
npm start
# or
yarn start

# For web development
npm run start-web
# or
yarn start-web
```

4. Run on your device:
- 📱 iOS: Press 'i' in the terminal or scan the QR code with your iPhone's camera
- 🤖 Android: Press 'a' in the terminal or scan the QR code with the Expo Go app
- 🌐 Web: Press 'w' in the terminal or wait for your browser to open

## Project Structure

```
rork_app/
├── app/                   # App navigation and screens
│   ├── (tabs)/           # Tab-based navigation
│   └── modal.tsx         # Modal screens
├── assets/               # Static assets
├── components/           # Reusable components
│   └── widgets/         # Widget components
├── constants/            # App constants
├── lib/                  # Utility functions
├── store/               # State management
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run start-web` - Start the web development server
- `npm run start-web-dev` - Start the web server with debug output

## Technologies Used

- [Expo](https://expo.dev/) - Development framework
- [React Native](https://reactnative.dev/) - Mobile framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Expo Router](https://docs.expo.dev/router/introduction/) - Navigation
- [NativeWind](https://www.nativewind.dev/) - Styling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
API_URL=your_api_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 