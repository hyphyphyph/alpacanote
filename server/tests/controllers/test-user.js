import Chai from 'chai';
import Config from '../../config';
import Fs from 'fs';
import KeyController from '../../controllers/key';
import LibPgp from '../../../libpgp';
import Path from 'path';
import Server from '../../server';

describe('UserController', () => {
  var server;
  var encryptedPassword

  before((done) => {
    server = new Server({
      hostname: Config.Server.Hostname,
      port: Config.Server.Port
    });

    server.init(() => {
      done();
    });
  });

  // Encrypting the password
  before((done) => {
    Fs.readFile('public.key', (err, publicKey) => {
      if (err) {
        done(err);
      }
      else {
        new LibPgp().encryptMessageWithPublicKey('password', publicKey)
          .then((encrypted) => {
            encryptedPassword = encrypted;
            done();
          });
      }
    });
  });

  after(() => {
    console.log('Fuck you')
    Fs.unlinkSync(Path.join(Config.LibAlpaca.DataDir, 'test0.user'));
    Fs.rmdirSync(Path.join(Config.LibAlpaca.DataDir, 'test0'));
  });

  it ('Should be able to registerNewUser', (done) => {
    server.server.inject({
      method: 'POST',
      url: '/user',
      payload: {
        username: 'test0',
        encryptedPassword: encryptedPassword
      }
    }, (result) => {
      Chai.expect(result.statusCode).to.equal(200);
      var json = JSON.parse(result.payload);
      Chai.expect(json).to.be.an.object;
      Chai.expect(json.message).to.equal('success');
      done();
    })
  });

});
