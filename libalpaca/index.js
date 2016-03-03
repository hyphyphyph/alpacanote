import * as CryptoJs from 'crypto-js';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Uuid from 'node-uuid';
import * as Bluebird from 'bluebird';

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
   * @method createUserDirectory
   */
  createUserDirectory (username) {
    return new Promise((resolve, reject) => {
      const userDir = Path.join(this.config.dataDir, username);
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
    var uuid = Uuid.v4();
    var userData = new UserData({
      uuid: uuid,
      encryptedUuid: CryptoJs.AES.encrypt(uuid, hashedPassword).toString()
    });

    return new Promise((resolve, reject) => {
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
            resolve(UserData);
          }
          catch (e) {
            reject(e);
          }
        }
      });
    });
  }
}

