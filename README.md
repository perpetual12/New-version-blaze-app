# BlazeTrade App

A modern trading platform built with React, Node.js, and MongoDB.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm
- MongoDB (or use the included Docker setup)
- Resend API key for email functionality

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Blazettrade-app-final
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

3. **Start the application**
   ```bash
   # Make the deploy script executable
   chmod +x deploy.sh
   
   # Run the deployment script
   ./deploy.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - MongoDB Express: http://localhost:8081

## Environment Variables

See `.env.example` for all required environment variables.

## Development

```bash
# Install dependencies
npm install
cd client && npm install

# Start development servers
npm run dev
```

## Production Deployment

### With Docker (Recommended)

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Without Docker

1. Set up a MongoDB database
2. Configure environment variables
3. Install dependencies
4. Build the client
5. Start the server

```bash
# Install dependencies
npm install
cd client && npm install

# Build client
npm run build

# Start server (from root directory)
NODE_ENV=production node src/server/server.cjs
```

## Features

- User authentication (signup, login, email verification)
- Password reset functionality
- Modern, responsive UI
- Secure API endpoints
- Containerized deployment

## License

This project is proprietary and confidential.
