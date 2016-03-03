import Chai from 'chai';
import Fs from 'fs';
import LibAlpaca from '../index';
import Path from 'path';

describe('LibAlpaca.readUserFile', () => {
  const alpaca = new LibAlpaca({
    dataDir: './build/libalpaca',
    salt: 'salt',
    pepper: 'pepper'
  });

  before((done) => {
    alpaca
      .createUserFile('user0', 'supersecretpassword')
      .then((userData) => {
        Chai.expect(userData).to.be.an.object;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after(() => {
    Fs.unlinkSync(Path.join(alpaca.config.dataDir, 'user0.user'));
  });

  it('Should be able to readUserFile for user0', (done) => {
    alpaca
      .readUserFile('user0')
      .then((userData) => {
        Chai.expect(userData).to.be.an.object;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should not be able to readUserFile for invalid user', (done) => {
    alpaca
      .readUserFile('user1')
      .then((userData) => {
        done(new Error('Should fail for invalid user user1'));
      })
      .catch((err) => {
        Chai.assert(err);
        done();
      });
  });

});

