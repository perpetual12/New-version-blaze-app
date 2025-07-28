# Deploying BlazeTrade to cPanel: A Step-by-Step Guide

This guide provides detailed instructions for deploying your full-stack MERN application (BlazeTrade) to a standard cPanel hosting environment.

---

### **Prerequisites**

1.  **Domain Name**: You have a registered domain name.
2.  **cPanel Hosting**: Your hosting plan includes cPanel access with "Setup Node.js App" functionality.
3.  **MongoDB Atlas Account**: A free account for hosting your database.
4.  **Production Email Service**: A free account with a service like SendGrid or Brevo for sending real emails.

---

### **Step 1: Configure Your Cloud Services**

Your database and email service will run on external cloud platforms that are optimized for those tasks.

#### **A. Set Up the Production Database (MongoDB Atlas)**

1.  **Create a Free Cluster**:
    *   Log in to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
    *   Create a new project and build a free `M0` cluster. Select a region close to you or your users.
2.  **Create a Database User**:
    *   In your cluster, go to **Database Access** and create a new database user. Remember the username and password.
3.  **Configure Network Access**:
    *   Go to **Network Access** and click **"Add IP Address"**.
    *   Select **"ALLOW ACCESS FROM ANYWHERE"** (which adds `0.0.0.0/0`). This is necessary for your cPanel server to connect.
4.  **Get Your Connection String**:
    *   Go back to your cluster's **Overview** and click **"Connect"**.
    *   Choose **"Connect your application"**.
    *   Copy the connection string provided. Replace `<password>` with the password you created. Keep this string safe.

#### **B. Set Up the Production Email Service (e.g., SendGrid)**

1.  **Create an Account**: Sign up for a free account on [SendGrid](https://sendgrid.com/) or another provider.
2.  **Get SMTP Credentials**:
    *   In your provider's dashboard, find the **SMTP settings**.
    *   You will get the `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS`. Keep these credentials ready.

---

### **Step 2: Deploy Your Backend (Node.js)**

1.  **Compress Your Backend**: Create a `.zip` file of your project, but **only include the following**: `src/server`, `package.json`, and `package-lock.json` from the root directory.
2.  **Upload to cPanel**:
    *   Log in to cPanel and open the **"File Manager"**.
    *   Navigate to the root directory (e.g., `/home/your_username`) and create a new folder named `blazetrade-backend`.
    *   Upload the `.zip` file into this new folder and extract it.
3.  **Set Up the Node.js App**:
    *   In cPanel, find and open **"Setup Node.js App"**.
    *   Click **"Create Application"**.
    *   **Application Root**: Set this to the path of your backend folder, e.g., `blazetrade-backend`.
    *   **Application URL**: This will be the sub-path for your API (e.g., `api`). Leave it blank if you want it at the root.
    *   **Application Startup File**: Set this to `src/server/server.cjs`.
    *   Click **"Create"**.
4.  **Install Dependencies & Add Environment Variables**:
    *   Once the application is created, click **"Run NPM Install"**.
    *   Scroll down to **"Environment Variables"** and add all your secrets:
        *   `MONGO_URI`: Your MongoDB Atlas connection string.
        *   `JWT_SECRET`: Your secret key.
        *   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Your production email credentials.
        *   `NODE_ENV`: `production`
    *   Click **"Restart"** at the top right.

---

### **Step 3: Deploy Your Frontend (React)**

1.  **Build the React App**:
    *   On your local computer, open a terminal in the `src/client` directory.
    *   Run the command: `npm run build`.
2.  **Upload the Build Files**:
    *   Compress the `build` folder (located at `src/client/build`) into a `.zip` file.
    *   In the cPanel **"File Manager"**, navigate to the **`public_html`** directory.
    *   Upload the `build.zip` file and extract it.
    *   **Important**: Move all the contents from the extracted `build` folder directly into `public_html`. The `index.html` file should be at `public_html/index.html`.

---

### **Step 4: Final Configuration & Testing**

Your backend is configured to serve your frontend's files in production, so no extra routing rules are needed.

1.  **Visit Your Domain**: Open your main domain (e.g., `https://www.yourdomain.com`) in a browser.
2.  **Test Functionality**:
    *   **Sign Up**: Create a new user account. Check your email for the welcome message and verify the new user appears in your MongoDB Atlas database.
    *   **Log In**: Log in with the new credentials to ensure authentication is working correctly.

Your BlazeTrade platform is now live! If you encounter any issues, check the Node.js app logs in cPanel for errors.
