const http = require('http');
const app = require('./app');
const connectDB = require('./utils/database');
require('dotenv').config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();