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

  after(() => {
    Fs.rmdirSync(Path.join(alpaca.config.dataDir, 'user0'));
  });

  it('Should be able to createUserDirectory for user0', (done) => {
    alpaca
      .createUserDirectory('user0')
      .then((userDir) => {
        Chai.expect(userDir).to.be.a.string;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should not be able to createUserDirectory for user0 since it already exists', (done) => {
    alpaca
      .createUserDirectory('user0')
      .then((userDir) => {
        done(new Error(`Should not have been able to create the user directory for ${username}`));
      })
      .catch((err) => {
        Chai.assert(err);
        done();
      });
  });

});

