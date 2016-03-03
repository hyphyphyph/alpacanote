import Chai from 'chai';
import Fs from 'fs';
import LibAlpaca from '../index';
import Path from 'path';

describe('LibAlpaca.decryptUserDirectoryListing', () => {
  const alpaca = new LibAlpaca({
    dataDir: './build/libalpaca',
    salt: 'salt',
    pepper: 'pepper'
  });
  var userData;
  var encryptedListing;

  before((done) => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.mkdirSync(userDir);
    Fs.writeFileSync(Path.join(userDir, '1.md'), 'plain');
    Fs.writeFileSync(Path.join(userDir, '2.md-encrypted'), 'encrypted');

    alpaca.createUserFile('user0', 'supersecret')
      .then((data) => {
        userData = data;

        alpaca
          .getEncryptedUserDirectoryListing('user0')
          .then((listing) => {
            encryptedListing = listing;
            done();
          })
          .catch((err) => {
            done(err);
          });

      });
  });

  after(() => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.unlinkSync(Path.join(userDir, '1.md'));
    Fs.unlinkSync(Path.join(userDir, '2.md-encrypted'));
    Fs.rmdirSync(userDir);

    Fs.unlinkSync(Path.join(alpaca.config.dataDir, 'user0.user'));
  });

  it('Should be able to decryptUserDirectoryListing for user0', (done) => {
    alpaca.decryptUserDirectoryListing(encryptedListing, userData.encryptedUuid, 'supersecret')
      .then((listing) => {
        Chai.expect(listing).to.be.an.array;
        Chai.expect(listing.length).to.equal(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

