module.exports = {
  apps : [
    {
      name        : 'creation',
      script      : './src/index.js',
      watch       : false,
      env: {
        'NODE_ENV': 'development',
        'DEBUG': 'creation:*',
        'PORT': 8080
      },
      env_production : {
        'NODE_ENV': 'production',
        'PORT': 80
      }
    }
  ]
}
