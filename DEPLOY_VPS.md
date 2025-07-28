# Deploying BlazeTrade to a Hostinger VPS

This guide provides a comprehensive walkthrough for deploying the BlazeTrade MERN stack application to a Hostinger VPS. It covers server setup, application configuration, and security best practices.

### **Prerequisites**

Before you begin, ensure you have the following:

1.  **Hostinger VPS Account**: An active VPS plan (e.g., KVM 2 or higher is recommended).
2.  **Domain Name**: A registered domain pointed to your Hostinger VPS IP address.
3.  **MongoDB Atlas Account**: A free account for your production database.
4.  **Production Email Service**: A free account with a service like SendGrid or Brevo for sending emails.
5.  **SSH Client**: A tool like PuTTY (Windows) or the built-in terminal (macOS/Linux) to connect to your VPS.

---

### **Step 1: Initial Server Setup**

First, connect to your VPS via SSH and perform the initial setup.

1.  **Connect to Your VPS**:
    ```bash
    ssh root@YOUR_VPS_IP
    ```

2.  **Update System Packages**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

3.  **Install Node.js and npm**:
    We'll use `nvm` (Node Version Manager) to install and manage Node.js.
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    source ~/.bashrc
    nvm install --lts
    ```

4.  **Install Essential Tools**:
    ```bash
    sudo apt install -y git nginx ufw
    ```

5.  **Configure Firewall (UFW)**:
    Allow SSH, HTTP, and HTTPS traffic.
    ```bash
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw enable
    ```

### **Step 2: Set Up Production Database and Email**

Your application needs a secure database and a reliable email service for production.

1.  **MongoDB Atlas**:
    - Log in to your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
    - Create a new project and a new cluster (the free M0 tier is sufficient).
    - In the **Database Access** section, create a new database user with a secure password.
    - In the **Network Access** section, add your VPS IP address to the IP access list (or allow access from anywhere: `0.0.0.0/0`).
    - Get your connection string (select "Connect your application") and replace `<password>` with the user password you created.

2.  **Email Service (SendGrid)**:
    - Sign up for a free account on [SendGrid](https://sendgrid.com/).
    - Verify your domain and create a new API key with full access.
    - **Important**: Store this API key securely; you will need it for your backend configuration.

### **Step 3: Deploy the BlazeTrade Application**

Now, you'll clone your application from GitHub and configure it for production.

1.  **Clone Your Repository**:
    ```bash
    git clone https://github.com/your-username/blazetrad-app.git /var/www/blazetrade
    cd /var/www/blazetrade
    ```

2.  **Install Dependencies**:
    - **Backend**:
      ```bash
      cd server
      npm install
      ```
    - **Frontend**:
      ```bash
      cd ../client
      npm install
      ```

3.  **Configure Backend Environment**:
    Create a `.env` file in the `server` directory:
    ```bash
    nano server/.env
    ```
    Add the following environment variables:
    ```env
    NODE_ENV=production
    PORT=5000
    MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
    JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY
    SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
    EMAIL_FROM=your-verified-email@yourdomain.com
    ```

4.  **Build the React Frontend**:
    ```bash
    cd client
    npm run build
    ```
    This creates a `build` directory with the optimized static files.

### **Step 4: Set Up Nginx as a Reverse Proxy**

Nginx will serve your React app and forward API requests to your Node.js server.

1.  **Create an Nginx Server Block**:
    ```bash
    sudo nano /etc/nginx/sites-available/blazetrade
    ```
    Add the following configuration, replacing `yourdomain.com` with your actual domain:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        root /var/www/blazetrade/client/build;
        index index.html;

        location / {
            try_files $uri /index.html;
        }

        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

2.  **Enable the Server Block**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/blazetrade /etc/nginx/sites-enabled/
    sudo nginx -t  # Test for syntax errors
    sudo systemctl restart nginx
    ```

### **Step 5: Run the Backend with PM2**

PM2 is a process manager that will keep your Node.js server running.

1.  **Install PM2**:
    ```bash
    sudo npm install -g pm2
    ```

2.  **Start Your Server**:
    Navigate to your backend directory and start the server:
    ```bash
    cd /var/www/blazetrade/server
    pm2 start server.js --name blazetrade-api
    ```

3.  **Enable PM2 Startup Script**:
    This ensures your app restarts automatically if the server reboots.
    ```bash
    pm2 startup
    pm2 save
    ```

### **Step 6: Secure Your Site with SSL (Let's Encrypt)**

Finally, secure your domain with a free SSL certificate.

1.  **Install Certbot**:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    ```

2.  **Obtain and Install SSL Certificate**:
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```
    Follow the on-screen prompts. Certbot will automatically update your Nginx configuration and set up auto-renewal.

---

Congratulations! Your BlazeTrade platform should now be live and accessible at `https://yourdomain.com`. The welcome emails will be sent via SendGrid whenever a new user signs up.
