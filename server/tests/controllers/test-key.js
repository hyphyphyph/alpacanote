import Chai from 'chai';
import Config from '../../config';
import KeyController from '../../controllers/key';
import KeyLogic from '../../logic/key';
import Server from '../../server';

describe('KeyController', () => {
  var server;

  before(function (done) {
    this.timeout(3600000);

    new KeyLogic({
      publicKeyFile: Config.Key.PublicKeyFile,
      privateKeyFile: Config.Key.PrivateKeyFile
    }).ensureKeyExists()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  before((done) => {
    server = new Server({
      hostname: Config.Server.Hostname,
      port: Config.Server.Port
    });

    server.init(() => {
      done();
    });
  });

  it ('Should be able to get the public key', (done) => {
    server.server.inject({
      method: 'GET',
      url: '/publickey'
    }, (result) => {
      Chai.expect(result.statusCode).to.equal(200);
      Chai.expect(result.payload).to.be.a.string;
      done();
    })
  });

  it ('Should be able to encrypt a message', (done) => {
    server.server.inject({
      method: 'POST',
      url: '/encrypt',
      payload: {
        message: "Hello World"
      }
    }, (result) => {
      Chai.expect(result.statusCode).to.equal(200);
      Chai.expect(result.payload).to.be.a.string;
      done();
    })
  });
});