const config = {
  // Use environment variable if set, otherwise default to localhost for development
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001'
};

export default config;
