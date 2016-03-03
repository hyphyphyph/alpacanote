import Chai from 'chai';
import Fs from 'fs';
import LibAlpaca from '../index';
import Path from 'path';

describe('LibAlpaca.getUserDirectoryListing', () => {
  const alpaca = new LibAlpaca({
    dataDir: './build/libalpaca',
    salt: 'salt',
    pepper: 'pepper'
  });

  before(() => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.mkdirSync(userDir);
    Fs.writeFileSync(Path.join(userDir, '1.md'), 'plain');
    Fs.writeFileSync(Path.join(userDir, '2.md-encrypted'), 'encrypted');
  });

  after(() => {
    var userDir = Path.join(alpaca.config.dataDir, 'user0');
    Fs.unlinkSync(Path.join(userDir, '1.md'));
    Fs.unlinkSync(Path.join(userDir, '2.md-encrypted'));
    Fs.rmdirSync(userDir);
  });

  it('Should be able to getUserDirectoryListing for user0', (done) => {
    alpaca
      .getUserDirectoryListing('user0')
      .then((files) => {
        Chai.expect(files).to.be.an.array;
        Chai.expect(files.length).to.equal(2);

        Chai.expect(files[0].filename).to.equal('build/libalpaca/user0/1.md');
        Chai.expect(files[0].title).to.equal('1');
        Chai.expect(files[0].encrypted).to.equal(false);

        Chai.expect(files[1].filename).to.equal('build/libalpaca/user0/2.md-encrypted');
        Chai.expect(files[1].title).to.equal('2');
        Chai.expect(files[1].encrypted).to.equal(true);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should not be able to getUserDirectoryListing for user1 (does not exist)', (done) => {
    alpaca
      .getUserDirectoryListing('user1')
      .then((files) => {
        done(new Error('Should not have been able to get a directory listing for a non-existent user.'));
      })
      .catch((err) => {
        Chai.assert(err);
        done();
      });
  });

});

