const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use(routes.router);

// Serve static files from express backend.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'build', 'index.html'));
  });
}

console.log(`API server is listening on port:${process.env.PORT || 3000}`);