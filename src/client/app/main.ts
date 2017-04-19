'use strict';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(success => {
      console.log('Angular has been boostrapped.');
    })
    .catch(err => {
      console.error(err);
    });
});
