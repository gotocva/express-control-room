const express = require('express');
const { ControlRoom, Log } = require('..');
const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

Log.debug('something')
app.use(ControlRoom);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
