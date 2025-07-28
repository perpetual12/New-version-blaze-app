# BlazeTrad - Bitcoin Exchange & Trading Platform

A professional Bitcoin exchange and trading website with a modern UI/UX, featuring a dark blue and white theme, contact information, and an interactive chatbot for brand-related questions.

## Features

- **Modern UI/UX**: Clean design with dark blue and white theme
- **Responsive Design**: Fully responsive across all devices
- **Interactive Chatbot**: Answers questions about the brand and services
- **Animated Elements**: Fade-in/fade-out effects on scroll
- **Contact Form**: Easy-to-use contact form for inquiries

## Pages

- **Home**: Overview of the platform with key features and statistics
- **About**: Company information, mission, vision, and team
- **Services**: Detailed information about offered services
- **Contact**: Contact form and company information

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: React Icons
- **UI Components**: Headless UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd blazetrad-app
```

2. Install dependencies

```bash
npm install
npm run install-client
```

3. Create a `.env` file in the root directory and add the following:

```
PORT=5000
NODE_ENV=development
```

### Running the Application

#### Development Mode

Run both the server and client concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Server only
npm run server

# Client only
npm run client
```

#### Production Mode

Build the client and start the server:

```bash
npm run build
npm start
```

### Accessing the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Project Structure

```
blazetrad-app/
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
└── src/                  # Source code
    ├── client/           # React frontend
    │   ├── public/       # Public assets
    │   ├── src/          # React source code
    │   │   ├── assets/   # Images, fonts, etc.
    │   │   ├── components/ # Reusable components
    │   │   ├── context/  # Context API
    │   │   ├── pages/    # Page components
    │   │   ├── App.js    # Main App component
    │   │   └── index.js  # Entry point
    │   └── package.json  # Client dependencies
    └── server/           # Express backend
        ├── config/       # Configuration files
        ├── controllers/  # Request handlers
        ├── models/       # Data models
        ├── routes/       # API routes
        └── server.js     # Server entry point
```

## License

This project is licensed under the ISC License.