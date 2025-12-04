# MongoDB Setup Guide

## The Error You're Seeing

The 500 Internal Server Error occurs because MongoDB is not running or not connected.

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Easiest) ⭐ Recommended

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course_management?retryWrites=true&w=majority
   PORT=5000
   ```
7. Replace `username` and `password` with your MongoDB Atlas credentials
8. Restart the backend server

### Option 2: Local MongoDB with Docker

1. Install Docker Desktop if not already installed
2. Run this command:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
3. Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=mongodb://localhost:27017/course_management
   PORT=5000
   ```
4. Restart the backend server

### Option 3: Install MongoDB Locally

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Or run: `mongod` in a terminal
4. Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=mongodb://localhost:27017/course_management
   PORT=5000
   ```
5. Restart the backend server

## After Setup

1. Restart the backend server (stop and start again)
2. You should see: `✅ Connected to MongoDB` in the console
3. The API should now work correctly

## Verify Connection

Check the backend console output. You should see:
- `✅ Connected to MongoDB` - Success!
- `❌ MongoDB connection error:` - Still not connected, check your setup

