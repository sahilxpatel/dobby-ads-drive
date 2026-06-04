# Dobby Ads Drive

## Live Demo
- **Frontend URL**: https://dobby-ads-drive-pearl.vercel.app/
- **Backend API URL**: https://dobby-ads-drive.onrender.com
- **Demo credentials**:
  - Email: test_123@test.com
  - Password: password123

Dobby Ads Drive is a full-stack MERN application that provides a drive-like experience. Users can create accounts, manage folders, and upload images to their drive. The application uses Cloudinary for secure and reliable image storage.

## Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT).
- **Drive Management**: Create and organize folders.
- **Nested Folders**: Create folders inside folders, similar to Google Drive
- **Folder Size**: Each folder displays total size including all nested content
- **User Isolation**: Users can only see their own folders and images
- **Image Uploads**: Upload images securely directly to Cloudinary.
- **Responsive UI**: A modern React-based frontend built with Vite.

## Tech Stack

**Client:**
- React 19
- Vite
- React Router DOM
- Axios

**Server:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs for authentication
- Multer & Cloudinary for image processing and storage

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd dobby-ads-drive
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

---

## Configuration

### Server Environment Variables

Create a `.env` file in the `server` directory and add the following variables. You can use the provided `.env.example` as a template:

```env
# Server Port
PORT=5000

# MongoDB Connection String (e.g. mongodb://localhost:27017/dobby-ads)
MONGO_URI=mongodb://localhost:27017/dobby-ads

# JWT Secret for signing tokens (Use a strong random string in production)
JWT_SECRET=supersecretkey_change_in_production

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Application

To run both the server and the client in development mode, follow these steps:

1. **Start the Backend Server:**
   Open a terminal, navigate to the `server` directory, and run:
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

2. **Start the Frontend Client:**
   Open a new terminal, navigate to the `client` directory, and run:
   ```bash
   cd client
   npm run dev
   ```
   The Vite development server will start, typically on `http://localhost:5173`.

---

## API Endpoints Overview

- **Auth Routes (`/api/auth`)**: Handles user registration and login.
- **Folder Routes (`/api/folders`)**: Create and list drive folders.
- **Image Routes (`/api/images`)**: Handle image uploads and retrieval.

---

## MCP Server (Bonus)

This project includes an MCP (Model Context Protocol) server that exposes 
backend actions as tools for AI assistants like Claude Desktop.

### MCP Tools Available

| Tool | Description |
|------|-------------|
| `create_folder` | Creates a new folder, supports nested folders via parentId |
| `list_folders` | Lists all folders for the authenticated user |
| `upload_image` | Uploads an image to a specific folder |

### Setup MCP with Claude Desktop

1. Install [Claude Desktop](https://claude.ai/download)

2. Add the following to your Claude Desktop config file:
   - **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dobby-ads": {
      "command": "node",
      "args": ["/absolute/path/to/server/mcp/index.js"],
      "env": {
        "API_BASE_URL": "https://dobby-ads-drive.onrender.com"
      }
    }
  }
}
```

3. Restart Claude Desktop — a hammer icon 🔨 will appear in the chat input

4. Get your JWT token from the app (DevTools → Application → LocalStorage)

5. Start using natural language commands:
   - "My token is eyJ... List all my folders"
   - "Create a folder called Campaigns"
   - "Create a nested folder called Summer inside Campaigns"

### MCP Server Location
The MCP server code is located at `server/mcp/index.js`

---

## Project Structure

```text
dobby-ads-drive/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── components/     # UI components (Grid, Modals, Breadcrumb)
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components (Login, Signup, Drive)
│   │   ├── App.jsx         # Application routing
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose Models (User, Folder, Image)
│   ├── routes/             # API Routes
│   ├── middleware/         # Custom Middleware (Auth)
│   ├── mcp/                # MCP Server Implementation
│   ├── server.js           # Express App entry point
│   ├── .env.example        # Env template
│   └── package.json
└── README.md
```

Enjoy using Dobby Ads Drive!
