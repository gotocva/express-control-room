# express-control-room

[![npm version](https://badge.fury.io/js/express-control-room.svg)](https://www.npmjs.com/package/express-control-room)


Express Control Room is a middleware package for the Express.js framework designed to provide a centralized control interface for managing and monitoring various aspects of your Express application and the server. It offers features such as real-time logging, route management, and request/response inspection, server monitoring.


### Installation

```bash
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

### Features

- [x] Custom logs store and realtime response
- [ ] Real-time logging of server activities.
- [ ] Dynamic route management and inspection.
- [ ] Request and response analysis for debugging.
- [ ] Request logs store and realtime response
- [ ] PM2 application management

### License

MIT