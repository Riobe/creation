module.exports = {
  apps : [
    {
      name        : 'jeremypridemore-me',
      script      : './src/index.js',
      watch       : false,
      env: {
        'NODE_ENV': 'development',
        'DEBUG': 'jeremypridemore:*',
        'PORT': 3000
      },
      'env_production': {
        'NODE_ENV': 'production',
        'PORT': 3000
      }
    }
  ]
};
