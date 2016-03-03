import Chai from 'chai';
import Fs from 'fs';
import LibAlpaca from '../index';
import Path from 'path';

describe('LibAlpaca.createUserFile', () => {
  const alpaca = new LibAlpaca({
    dataDir: './build/libalpaca',
    salt: 'salt',
    pepper: 'pepper'
  });

  after(() => {
    Fs.unlinkSync(Path.join(alpaca.config.dataDir, 'user0.user'));
  });

  it('Should be able to createUserFile for user0', (done) => {
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

  it('Should not be able to createUserFile for user0 again', (done) => {
    alpaca
      .createUserFile('user0', 'supersecretpassword')
      .then((userData) => {
        done(new Error(`Should not have been able to create the user file for user0 because it already exists.`));
        done();
      })
      .catch((err) => {
        Chai.assert(err);
        done();
      });
  });

  it('Should not be able to createUserFile in invalid directory', (done) => {
    const alpaca = new LibAlpaca({
      dataDir: './build/libalpaca/data',
      salt: 'salt',
      pepper: 'pepper'
    });

    alpaca
      .createUserFile('user1', 'supersecretpassword')
      .then((userData) => {
        done(new Error(`Should not be able to create the user file if the ${alpaca.config.dataDir} directory does not exist.`));
      })
      .catch((err) => {
        Chai.assert(err);
        done();
      });
  });

});

