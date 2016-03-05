import Fs from 'fs';
import LibPgp from '../../libpgp';
import Promise from 'bluebird';

export default class KeyLogic {
  /**
   * @param config
   * @param config.publicKeyFile {string} Path the public key file.
   * @param config.privateKeyFile {string} Path to the private key file.
   */
  constructor ({
    publicKeyFile = 'public.key',
    privateKeyFile = 'private.key'
  }) {
    this.config = {
      publicKeyFile: publicKeyFile,
      privateKeyFile: privateKeyFile
    }
  }

  /**
   * If the public and private keys don't exist, generate them.
   *
   * @return {Promise}
   */
  ensureKeyExists () {
    return new Promise((resolve, reject) => {
      var publicKeyExists = Fs.existsSync(this.config.publicKeyFile);
      var privateKeyExists = Fs.existsSync(this.config.privateKeyFile);
      if (!publicKeyExists || !privateKeyExists) {
        console.log('Generating Keys... Please wait.');
        new LibPgp()
          .generateKeys()
          .then((key) => {
            Fs.writeFileSync('public.key', key.publicKey);
            Fs.writeFileSync('private.key', key.privateKey);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }
      else {
        resolve()
      }
    });
  }

  readPublicKey () {
    return new Promise((resolve, reject) => {
      Fs.readFile(this.config.publicKeyFile, (err, content) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(content);
        }
      });
    });
  }

  readPrivateKey () {
    return new Promise((resolve, reject) => {
      Fs.readFile(this.config.privateKeyFile, (err, content) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(content);
        }
      });
    });
  }
}
