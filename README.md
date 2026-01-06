# UkaukaBaboon - IoT Water Dispenser System

A comprehensive IoT water dispenser management system that combines hardware (ESP8266), backend server, and a modern web interface to track and monitor water consumption.

## 🎯 Project Overview

**UkaukaBaboon** is an IoT-based water dispenser project that allows users to:
- Track personal daily water consumption in real-time
- Monitor remaining water levels in the dispenser
- Authenticate users before dispensing water
- View consumption statistics through a web dashboard
- Control water dispensing via physical buttons on the IoT device

## 🏗️ System Architecture

The project consists of three main components:

### 1. **IoT Device (ESP8266)**
- Hardware: ESP8266 microcontroller with LCD display (I2C)
- Display: 16x2 LCD showing water levels and user info
- Controls: Two buttons (Water Dispense & Reset)
- Connectivity: WiFi-enabled for API communication
- Features:
  - Real-time status polling from server
  - Dispenses 50ml per tick when button pressed
  - LCD display shows remaining water and user consumption
  - Reset functionality to clear session

### 2. **Backend Server (Node.js + Express)**
- RESTful API server running on port 3000
- File-based data persistence (JSON)
- Features:
  - User authentication (register/login/logout)
  - Water consumption tracking
  - Device state management
  - Real-time status updates for IoT device
  - Dashboard data aggregation

### 3. **Frontend Web Application (React + TypeScript + Vite)**
- Modern single-page application
- Built with React 19, TypeScript, and Vite
- Styled with Tailwind CSS
- Features:
  - User authentication UI
  - Real-time dashboard showing:
    - Current water level
    - Active user information
    - All users' consumption statistics
  - Responsive design

## 📁 Project Structure

```
ProjectFinal_Iot/
├── ESP/                      # ESP8266 Arduino code
│   ├── ESP.ino              # Main IoT device firmware
│   └── data/                # Additional device data
├── src/                      # React frontend source
│   ├── components/          # Reusable React components
│   │   ├── AuthForm.tsx     # Authentication form
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── UserCard.tsx     # User information card
│   │   ├── UserList.tsx     # List of users
│   │   └── WaterPanel.tsx   # Water level display
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Login.tsx        # Login page
│   │   └── Register.tsx     # Registration page
│   ├── services/            # API service layer
│   ├── style/               # CSS styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── server.js                # Express backend server
├── users.json               # User data storage
├── state.json               # System state storage
├── index.html               # HTML template
└── package.json             # Node.js dependencies

```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### IoT Device
- `GET /api/iot/status` - Get current status for LCD display
- `POST /api/device/update` - Record water usage
- `POST /api/device/reset` - Reset device state

### Dashboard
- `GET /api/dashboard` - Get all dashboard data (users, water level, active user)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- ESP8266 board (for hardware component)
- Arduino IDE (for programming ESP8266)

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
node server.js
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

### ESP8266 Setup

1. Open `ESP/ESP.ino` in Arduino IDE
2. Update WiFi credentials:
   - `WIFI_SSID`: Your WiFi network name
   - `WIFI_PASS`: Your WiFi password
3. Update `BASE_URL` to match your backend server IP and port
4. Install required libraries:
   - ESP8266WiFi
   - ESP8266HTTPClient
   - ArduinoJson
   - Wire
   - LiquidCrystal_I2C
5. Upload to ESP8266 board

## 🎮 Usage

1. **Start Backend**: Run `node server.js`
2. **Start Frontend**: Run `npm run dev` and open in browser
3. **Power On Device**: ESP8266 will connect to WiFi and poll server
4. **Register/Login**: Use web interface to create account
5. **Dispense Water**: Press the use button on ESP8266 device
6. **Monitor**: View real-time consumption on LCD and web dashboard
7. **Reset**: Press reset button to clear session

## 💧 Water Tracking Logic

- Initial water capacity: 10 liters (10,000ml)
- Dispense rate: 50ml per tick (200ms intervals while button held)
- Consumption is tracked per user
- Water level decreases as users dispense
- System prevents dispensing when tank is empty

## 🛠️ Technology Stack

### Hardware
- ESP8266 microcontroller
- 16x2 I2C LCD display
- Push buttons (x2)

### Backend
- Node.js
- Express.js
- CORS middleware
- File system (fs) for data persistence

### Frontend
- React 19
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Axios (HTTP client)

### IoT/Embedded
- Arduino framework
- ESP8266 libraries
- ArduinoJson

## 📊 Data Storage

The system uses JSON files for data persistence:

- **users.json**: Stores user credentials and consumption data
- **state.json**: Stores active user session and remaining water level

## 🔐 Security Note

⚠️ **Warning**: This is a prototype/educational project. The authentication system stores passwords in plain text. For production use, implement:
- Proper password hashing (bcrypt, argon2, etc.)
- Authentication tokens (JWT) with proper session management
- HTTPS/TLS for encrypted communication
- Input validation and sanitization
- Rate limiting for API endpoints

## 📝 Development

### Linting
```bash
npm run lint
```

### Type Checking
The project uses TypeScript for type safety. Configuration files:
- `tsconfig.json` - Main TypeScript config
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node-specific config

## 🎨 Styling

The project uses Tailwind CSS v4 with Vite plugin for styling. The configuration is in `vite.config.ts`.

## 📄 License

ISC

## 👥 Authors

IoT Final Project - Water Dispenser Management System
