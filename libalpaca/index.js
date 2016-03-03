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
  constructor (config) {
    this.config = config;
  }

  /**
   * @method _hashValue
   * @private
   */
  _hashValue (value) {
    return CryptoJs.SHA1(`${this.config.salt}${value}${this.config.pepper}`);
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
      Fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
          return reject(err);
        }
        else {
          return resolve(userData);
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

