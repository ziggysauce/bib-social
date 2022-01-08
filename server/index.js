const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const routes = require('./routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

db.migrate();

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

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
