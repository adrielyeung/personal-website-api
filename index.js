require('dotenv').config();

// node.js environment in process object
// Use environment variable PORT if possible, otherwise use 3000 (e.g. dev machine)
const PORT = process.env.PORT || 3001;

// Returns express function, used to create API handling requests
const express = require('express');
const app = express();

// Returns mongoose object to connect to mongodb database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

// Get MongoDB default connection object created with .connect
const db = mongoose.connection;
// On any connection error, log it
db.on('error', (error) => console.error(error));
// Just once, when database connection is opened, log it
db.once('open', () => console.log('Connected to Database'));

// Enable CORS
const cors = require('cors');
const whitelist = ["https://adrieltheexplorer.com", "https://uat.adrieltheexplorer.com", "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

// Use middleware to enable JSON parsing
app.use(express.json());
// Also parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
  }));

// Use Router middleware to route endpoints
const musicRouter = require('./routes/music');
const userRouter = require('./routes/user');

// Map routes to router
app.use('/api/music', musicRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
