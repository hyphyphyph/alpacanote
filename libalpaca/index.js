import CryptoJs from 'crypto-js';
import Fs from 'fs';
import Glob from 'glob'
import Kbpgp from 'kbpgp';
import Path from 'path';
import Uuid from 'node-uuid';
import Bluebird from 'bluebird';

class UserData {
  constructor ({
    uuid = '',
    encryptedUuid = ''
  }) {
    this.uuid = uuid;
    this.encryptedUuid = encryptedUuid;
  }

  toObject () {
    return {
      uuid: this.uuid,
      encryptedUuid: this.encryptedUuid
    };
  }
}

export default class LibAlpaca {
  constructor ({
    dataDir = '',
    salt = '',
    pepper = ''
  }) {
    this.config = {
      dataDir: dataDir,
      salt: salt,
      pepper: pepper
    };
  }

  /**
   * @method _hashValue
   * @private
   */
  _hashValue (value) {
    return CryptoJs.SHA1(`${this.config.salt}${value}${this.config.pepper}`);
  }

  /**
   * @method _getUserDir
   * @private
   */
  _getUserDir (username) {
    return Path.join(this.config.dataDir, username);
  }

  /**
   * @method decryptUserDirectoryListing
   */
  decryptUserDirectoryListing (encryptedListing, encryptedUuid, hashedPassword) {
    return new Promise((resolve, reject) => {
      var uuid = CryptoJs.AES.decrypt(encryptedUuid, hashedPassword).toString(CryptoJs.enc.Utf8);
      var listing = CryptoJs.AES.decrypt(encryptedListing, uuid).toString(CryptoJs.enc.Utf8);

      try {
        resolve(JSON.parse(listing));
      }
      catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @method getEncryptedUserDirectoryListing
   */
  getEncryptedUserDirectoryListing (username) {
    return new Promise((resolve, reject) => {

      this.readUserFile(username)
        .then((userData) => {

          this.getUserDirectoryListing(username)
            .then((files) => {

              const filesString = JSON.stringify(files);
              const encryptedFilesString = CryptoJs.AES.encrypt(filesString, userData.uuid);
              resolve(encryptedFilesString.toString());

            })
            .catch((err) => {
              reject(err);
            });

        })
        .catch((err) => {
          reject(err);
        });

    });
  }

  /**
   * @method getUserDirectoryListing
   */
  getUserDirectoryListing (username) {
    return new Promise((resolve, reject) => {
      var userDir = this._getUserDir(username);
      Fs.exists(userDir, (exists) => {
        if (!exists) {
          reject(new Error(`User directory ${userDir} does not exist`));
        }
        else {
          Glob(Path.join(userDir, '*.md*'), (err, files) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(files.map((file) => {
                return {
                  filename: file,
                  title: Path.basename(file).slice(0, 0 - Path.extname(Path.basename(file)).length),
                  encrypted: Path.extname(file).indexOf('encrypted') < 0 ? false : true
                };
              }));
            }
          });
        }
      });
    });
  }

  /**
   * @method createUserDirectory
   */
  createUserDirectory (username) {
    return new Promise((resolve, reject) => {
      const userDir = this._getUserDir(username);
      Fs.exists(userDir, (exists) => {
        if (exists) {
          reject(new Error(`User directory ${userDir} already exists.`));
        }
        else {
          Fs.mkdir(userDir, (err) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(userDir);
            }
          });
        }
      });
    });
  }

  /**
   * @method createUserFile
   */
  createUserFile (username, hashedPassword) {
    return new Promise((resolve, reject) => {
      var uuid = Uuid.v4();
      var userData = new UserData({
        uuid: uuid,
        encryptedUuid: CryptoJs.AES.encrypt(uuid, hashedPassword).toString()
      });
      const filePath = Path.join(this.config.dataDir, `${username}.user`);
      const fileContent = JSON.stringify(userData.toObject());
      Fs.exists(filePath, (exists) => {
        if (exists) {
          reject(new Error(`User file for ${username} already exists.`));
        }
        else {
          Fs.writeFile(filePath, fileContent, 'utf8', (err) => {
            if (err) {
              return reject(err);
            }
            else {
              return resolve(userData);
            }
          });
        }
      });
    });
  }

  /**
   * @method readUserFile
   */
  readUserFile (username) {
    return new Promise((resolve, reject) => {
      const filePath = Path.join(this.config.dataDir, `${username}.user`);
      Fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
          reject(err);
        }
        else {
          try {
            var userData = new UserData(JSON.parse(fileContent));
            resolve(userData);
          }
          catch (e) {
            reject(e);
          }
        }
      });
    });
  }
}

