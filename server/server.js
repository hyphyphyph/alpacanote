import * as Hapi from 'hapi';
import * as Good from 'good';

export default class Server {
  constructor (config) {
    this.config = config;
    this.server = new Hapi.Server();
    this.server.connection({
      host: config.hostname,
      port: config.port
    });

  }

  _registerLoggers (done) {
    done();
  }

  init (done) {
    this._registerLoggers(() => {
      done();
    });
  }

  start () {
    this.server.start((err) => {
      if (err) {
        throw err;
      }
      console.log(`Server Running on: ${this.config.hostname}:${this.config.port}`);
    });
  }
}
