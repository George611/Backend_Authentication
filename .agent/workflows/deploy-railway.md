---
description: How to deploy the backend and database to Railway
---

### 1. Push Code to GitHub
Ensure all your changes are committed and pushed to a GitHub repository. Railway deployments work best when connected to GitHub.

### 2. Connect to Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **"New Project"**.
3. Select **"Deploy from GitHub repo"** and choose your repository.

### 3. Provision MySQL Database
1. In your Railway project dashboard, click **"Add Service"** -> **"Database"** -> **"MySQL"**.
2. Once the database is ready, click on it and go to the **"Variables"** tab.
3. Railway automatically creates a `DATABASE_URL` variable. Copy its value.

### 4. Configure Backend Service
1. Click on your connected GitHub service in the Railway dashboard.
2. Go to **"Settings"** -> **"Root Directory"** and set it to `/auth-backend` (if your backend is in that subdirectory).
3. Go to **"Variables"** and add:
   - `DATABASE_URL`: (The value you copied from the MySQL service)
   - `JWT_SECRET`: (A secure random string)
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Railway will assign this automatically, but setting it ensures consistency)
   - `FRONTEND_URL`: (Your frontend URL after you deploy it, e.g., on Vercel)

### 5. Initialize the Database
1. Use the Railway **"Query"** tool or connect locally (using the "Connect" tab info) and run:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Verify Deployment
Once the deployment finishes, Railway will provide you with a URL (e.g., `your-app.up.railway.app`). You can test it by visiting:
`https://your-app.up.railway.app/`
It should say: **"Auth API is running in production mode..."**
