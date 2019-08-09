const express = require('express');
const choreRouter = require('./chores');

const server = express();

server.use(express.json());
server.use('/api/chores', choreRouter);

server.get('/', (req, res) => res.send(`<h2>We are a go!</h2>`))

module.exports = server;