import Chai from 'chai';
import LibAlpaca from '../index';

describe('LibAlpaca.createUserFile', () => {

  it('Should be able to createUserFile for user0', (done) => {
    const alpaca = new LibAlpaca({
      dataDir: './build/libalpaca',
      salt: 'salt',
      pepper: 'pepper'
    });

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
        Chai.expect(err);
        done();
      });
  });

});

