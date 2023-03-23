const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);
  server.start();
  console.log('server running on post ' + server.info.uri);
};

init();
