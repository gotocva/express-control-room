# express-control-room


### Installation

```shell
npm i express-control-room
```

### Getting started 

```javascript
const express = require('express');
const { ControlRoom } = require('express-control-room');

const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// connect ControlRoom into express using middleware
app.use(ControlRoom);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```