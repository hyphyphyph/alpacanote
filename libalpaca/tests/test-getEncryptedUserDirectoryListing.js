import Chai from 'chai';
import Fs from 'fs';
import LibAlpaca from '../index';
import Path from 'path';

describe('LibAlpaca.getEncryptedUserDirectoryListing', () => {
  const alpaca = new LibAlpaca({
    dataDir: './build/libalpaca',
    salt: 'salt',
    pepper: 'pepper'
  });

  before((done) => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.mkdirSync(userDir);
    Fs.writeFileSync(Path.join(userDir, '1.md'), 'plain');
    Fs.writeFileSync(Path.join(userDir, '2.md-encrypted'), 'encrypted');

    alpaca.createUserFile('user0', 'supersecret')
      .then(() => {
        done();
      });
  });

  after(() => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.unlinkSync(Path.join(userDir, '1.md'));
    Fs.unlinkSync(Path.join(userDir, '2.md-encrypted'));
    Fs.rmdirSync(userDir);

    Fs.unlinkSync(Path.join(alpaca.config.dataDir, 'user0.user'));
  });

  it('Should be able to getEncryptedUserDirectoryListing for user0', (done) => {
    alpaca
      .getEncryptedUserDirectoryListing('user0')
      .then((encryptedListing) => {
        Chai.expect(encryptedListing).to.be.a.string;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

