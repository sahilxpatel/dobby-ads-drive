# Dobby Ads Drive

Dobby Ads Drive is a full-stack MERN application that provides a drive-like experience. Users can create accounts, manage folders, and upload images to their drive. The application uses Cloudinary for secure and reliable image storage.

## Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT).
- **Drive Management**: Create and organize folders.
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

Enjoy using Dobby Ads Drive!
