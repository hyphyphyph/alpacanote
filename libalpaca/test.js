import LibAlpaca from './index';

const alpaca = new LibAlpaca({
  dataDir: './data',
  salt: 'salt',
  pepper: 'pepper'
});

console.log('Test createUserFile');
alpaca
  .createUserFile('hyphyphyph', 'derekmounce')
  .then((userData) => {
    console.log(userData);
  })
  .catch((err) => {
    throw err;
  });

