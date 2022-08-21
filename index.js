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
const whitelist = ["https://uat.adrieltheexplorer.com", "https://adrieltheexplorer.com", "http://localhost:3000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

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
