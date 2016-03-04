import Chai from 'chai';
import Fs from 'fs';
import LibPgp from '../index';

describe('LibPgp', () => {
  var publicKey;
  var privateKey;
  var encryptedMessage;

  it('Should be able to generateKeys', function (done) {
    // This could take a while...
    this.timeout(3600000);

    new LibPgp().generateKeys()
      .then((key) => {
        Chai.expect(key).to.be.an.object;
        Chai.expect(key.publicKey).to.be.a.string;
        Chai.expect(key.privateKey).to.be.a.string;

        publicKey = key.publicKey;
        privateKey = key.privateKey;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to encryptMessageWithPublicKey', (done) => {
    new LibPgp().encryptMessageWithPublicKey('Hello World', publicKey)
      .then((result) => {
        Chai.expect(result).to.be.a.string;

        encryptedMessage = result;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to decryptMessageWithPrivateKey', (done) => {
    new LibPgp().decryptMessageWithPrivateKey(encryptedMessage, privateKey)
      .then((result) => {
        Chai.expect(result).to.be.a.string;
        Chai.expect(result).to.equal('Hello World');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

