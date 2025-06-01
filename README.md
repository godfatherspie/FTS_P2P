# 🔐 Secure P2P File Transfer

A simple and secure peer-to-peer file transfer web app using WebSockets. Files are shared using a unique room ID and a password, with optional link expiry.

## 🚀 Features

- 📁 Send files directly to a peer without uploading to a server
- 🔒 Password-protected transfers
- ⏱️ Expiry timer for file availability
- ⚡ Real-time transfer using WebSockets
- 🔗 Shareable transfer link with unique ID

## 🛠️ Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- Node.js + Express
- WebSocket (`ws`)
- LocalStorage for temporary sender data

## 🖥️ How It Works

1. **Sender**
   - Select a file, set a password, and define expiry time.
   - Get a unique link to share.

2. **Receiver**
   - Open the link and enter the password.
   - Wait for sender to reconnect and reselect the file.
   - Download begins instantly.

## 📦 Setup & Run

### Server

   - git clone https://github.com/godfatherspie/FTS_P2P.git
   - cd FTS_P2P
   - npm install
   - .\kill_port_3000.bat

Navigate to "localhost:3000" on your favourite web browser and enjoy!
