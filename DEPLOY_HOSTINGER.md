# Deploying Your BlazeTrade MERN App to Hostinger

This guide provides step-by-step instructions for deploying your full-stack MERN (MongoDB, Express, React, Node.js) application to a Hostinger plan that supports Node.js (such as their VPS or Business shared hosting plans).

## Prerequisites

1.  **Hostinger Account**: A hosting plan that supports Node.js.
2.  **Domain Name**: A registered domain pointed to your Hostinger account.
3.  **SSH Access**: Ensure you can connect to your server via SSH. You can find credentials and instructions in your Hostinger hPanel.
4.  **Project Ready**: Your application code is complete and pushed to a Git repository (recommended) or zipped.

---

## Deployment Steps

### Step 1: Prepare Your Local Project

Before uploading, ensure your project is clean and ready.

1.  **Delete `node_modules`**: Remove the `node_modules` folders from both your `src/server` and `src/client` directories. These will be reinstalled on the server.
    ```bash
    # In your project root
    rm -rf src/server/node_modules
    rm -rf src/client/node_modules
    ```
2.  **Zip Your Project**: Create a zip file of your entire project directory (e.g., `blazetrad-app.zip`).

### Step 2: Upload Project to Hostinger

You can upload your project in two ways:

*   **Method A: Using Hostinger File Manager (Easier)**
    1.  Log in to your Hostinger hPanel.
    2.  Go to `Files` -> `File Manager`.
    3.  Navigate to the `public_html` directory (or your preferred directory).
    4.  Click the **Upload** icon and select your `blazetrad-app.zip` file.
    5.  Once uploaded, right-click the zip file and select **Extract**. Choose a folder name (e.g., `blazetrad-app`).

*   **Method B: Using SSH and Git (Recommended)**
    1.  Connect to your server via SSH.
    2.  Navigate to your desired directory (e.g., `cd public_html`).
    3.  Clone your project from your Git repository:
        ```bash
        git clone <your-repository-url> blazetrad-app
        ```

### Step 3: Set Up Node.js on Hostinger

1.  In your hPanel, go to `Advanced` -> `Node.js Setup`.
2.  Click **Create Application**.
3.  - **Node.js version**: Select the latest LTS version (e.g., 18.x.x).
    - **Application mode**: Select `production`.
    - **Application root**: Set this to the path of your **server** directory (e.g., `public_html/blazetrad-app/src/server`).
    - **Application startup file**: Set this to `server.cjs`.
4.  Click **Create**. This will set up the environment and create a `package.json` if one doesn't exist.

### Step 4: Install Dependencies

1.  Connect to your server via SSH.
2.  Navigate to your application's root directory (e.g., `cd public_html/blazetrad-app`).
3.  **Install Server Dependencies**:
    ```bash
    cd src/server
    npm install
    ```
4.  **Install Client Dependencies**:
    *Note: The client dependencies are only needed for the build step, which we've already done. However, if you need to rebuild on the server, you would run this.*
    ```bash
    cd ../client
    npm install
    ```

### Step 5: Configure Environment Variables

Your application requires sensitive keys. Do not hard-code them.

1.  In your hPanel, go back to the `Node.js Setup` for your application.
2.  Find the section for **Environment Variables**.
3.  Click **Add Variable** and create entries for each of the following:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: Your full MongoDB connection string.
    *   `JWT_SECRET`: A long, random, and secret string.
    *   `CLIENT_URL`: Your live domain name (e.g., `https://www.blazetrade.com`).
    *   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: Your production email sending credentials (e.g., from SendGrid, not Ethereal).
4.  Save the changes. You may need to restart the application for these to take effect.

### Step 6: Start Your Application with PM2

Hostinger's Node.js setup often uses **PM2**, a process manager that keeps your app running.

1.  In the `Node.js Setup` page, you should see controls to **Stop** and **Restart** your application. Click **Restart** to apply all your changes.
2.  You can check the status and logs via SSH:
    ```bash
    # List all running Node.js applications
    pm2 list

    # View real-time logs for your app
    pm2 logs <your-app-name>
    ```

### Step 7: Final Checks

1.  **Access Your Site**: Open your domain in a browser. Your BlazeTrade application should now be live.
2.  **Test Functionality**: Test the signup, email verification, and login processes to ensure everything is working with your production environment variables.

---

Congratulations! Your BlazeTrade platform is now deployed on Hostinger.
