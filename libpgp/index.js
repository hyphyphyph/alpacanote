import Promise from 'bluebird';
import Kbpgp from 'kbpgp';

export default class LibPgp {
  /**
   * @method generateKeys
   */
  generateKeys () {
    return new Promise((resolve, reject) => {
      Kbpgp.KeyManager.generate_rsa(
        {
          userid: 'AlpacaNote',
        },
        (err, key) => {
          if (err) {
            reject(err);
          }
          else {
            key.sign({}, () => {
              key.export_pgp_public({}, (err, publicKey) => {
                if (err) {
                  reject(err);
                }
                else {
                  key.export_pgp_private({}, (err, privateKey) => {
                    if (err) {
                      reject(err);
                    }
                    else {
                      resolve({
                        publicKey: publicKey,
                        privateKey: privateKey
                      });
                    }
                  });
                }
              });
            });
          }
        }
      );
    });
  }

  /**
   * @method encryptMessageWithPublicKey
   */
  encryptMessageWithPublicKey (message, publicKey) {
    return new Promise((resolve, reject) => {
      Kbpgp.KeyManager.import_from_armored_pgp(
        {
          armored: publicKey
        },
        (err, key) => {
          key.sign({}, () => {
            Kbpgp.box(
              {
                msg: message,
                encrypt_for: key
              },
              (err, encryptedMessage) => {
                if (err) {
                  reject(err);
                }
                else {
                  resolve(encryptedMessage);
                }
              }
            );
          });
        }
      );
    });
  }

  /**
   * @method decryptMessageWithPrivateKey
   */
  decryptMessageWithPrivateKey (encryptedMessage, privateKey) {
    return new Promise((resolve, reject) => {
      Kbpgp.KeyManager.import_from_armored_pgp(
        {
          armored: privateKey,
        },
        (err, key) => {
          if (err) {
            reject(err);
          }
          else {
            key.sign({}, () => {
              Kbpgp.unbox(
                {
                  keyfetch: key,
                  armored: encryptedMessage
                },
                (err, literals) => {
                  if (err) {
                    reject(err);
                  }
                  else {
                    resolve(literals[0].toString());
                  }
                }
              );
            });
          }
        }
      );
    });
  }
}
