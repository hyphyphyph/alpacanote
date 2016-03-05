const Config = {
  Server: {
    Hostname: '0.0.0.0',
    Port: 3000
  },
  Key: {
    PublicKeyFile: 'public.key',
    PrivateKeyFile: 'private.key'
  },
  LibAlpaca: {
    DataDir: 'data',
    Salt: 'salt',
    Pepper: 'pepper'
  }
};

export default Config;
