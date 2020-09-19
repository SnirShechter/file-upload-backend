'use strict'
const { ServiceProvider } = require('@adonisjs/fold')

class HashIdsProvider extends ServiceProvider {
  register () {
    this.app.singleton('FileUpload/Src/HashIds', () => {
      const Config = this.app.use('Adonis/Src/Config')
      let hashIdsLibrary = require('hashids/cjs');
      let hashIdsProvider = new hashIdsLibrary(Config.get('hash.hashIds.salt'),Config.get('hash.hashIds.length'));
      return hashIdsProvider
    })
  }
  boot () {
  }
}

module.exports = HashIdsProvider
