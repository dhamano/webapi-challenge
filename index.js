const server = require('./server.js');

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`\n*** API running on port: ${port} ***`));