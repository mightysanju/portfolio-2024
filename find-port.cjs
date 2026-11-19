const { createServer } = require('node:net');

function findPort(port, cb) {
  const server = createServer();
  server.listen(port, '127.0.0.1', () => {
    const { port: p } = server.address();
    server.close(() => cb(p));
  });
  server.on('error', () => findPort(port + 1, cb));
}

findPort(5173, port => process.stdout.write(port.toString()));
