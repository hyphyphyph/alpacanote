import * as Hapi from 'hapi';

import Server from './server';
import Config from './config';

var server = new Server({
  hostname: Config.Server.Hostname,
  port: Config.Server.Port
});

server.init(() => {
  server.start();
});

