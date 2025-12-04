# Quick Fix for 500 Error - MongoDB Not Connected

## Problem
The backend server is returning 500 errors because MongoDB is not running.

## Easiest Solution: Use MongoDB Atlas (Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a FREE cluster (M0 Sandbox)

### Step 2: Get Connection String
1. In MongoDB Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Update .env File
1. Open `backend/.env` file
2. Replace the content with:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/course_management?retryWrites=true&w=majority
   PORT=5000
   ```
3. Replace `<username>` and `<password>` with your MongoDB Atlas credentials
4. Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address

### Step 4: Restart Backend Server
1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again: `cd backend && npm run dev`

### Step 5: Verify
Check the backend console - you should see:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

## Alternative: Install MongoDB Locally

If you prefer local MongoDB:

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Keep the `.env` file as is (it's already set for localhost)
5. Restart backend server

## Need Help?

Check `backend/SETUP.md` for detailed instructions.

