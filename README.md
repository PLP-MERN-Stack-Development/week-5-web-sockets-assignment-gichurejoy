[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19958685&assignment_repo_type=AssignmentRepo)
# Real-Time Chat Application with Socket.io

A feature-rich real-time chat application built with Socket.io, React, and Express. This application demonstrates bidirectional communication between clients and server, implementing various real-time features.

## Features

### Core Features
- ✅ Real-time messaging using Socket.io
- ✅ User authentication (username-based)
- ✅ Global chat room
- ✅ Online/offline user status
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Dark mode theme

### Advanced Features
- ✅ Private messaging between users
- ✅ File and image sharing
  - Image preview
  - File download support
  - Multiple file types supported
- ✅ Message reactions
  - Multiple reactions per message
  - Reaction counts
  - User lists in tooltips
- ✅ Real-time notifications
  - Browser notifications
  - New message alerts
  - Private message notifications
- ✅ Message search functionality
  - Real-time search results
  - Search in both global and private messages
- ✅ Message pagination
  - Load older messages
  - Automatic loading on scroll
  - Smooth scrolling

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── UserList.jsx
│   │   ├── context/      # React context providers
│   │   │   └── SocketContext.jsx
│   │   └── App.jsx       # Main application component
│   └── package.json
├── server/                # Node.js back-end
│   ├── config/           # Configuration files
│   ├── controllers/      # Socket event handlers
│   ├── models/          # Data models
│   ├── socket/          # Socket.io server setup
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=3000
   CLIENT_URL=http://localhost:5174
   JWT_SECRET=your_secret_key_here
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5174
   ```

## Usage

1. Enter your username to join the chat
2. Send messages in the global chat
3. Click on a user's name to start a private chat
4. Use the attachment button to share files
5. React to messages using the emoji button
6. Search messages using the search bar
7. Scroll up to load older messages

## Technologies Used

- **Frontend**:
  - React
  - Material-UI
  - Socket.io-client
  - date-fns

- **Backend**:
  - Node.js
  - Express
  - Socket.io
  - JWT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 