'use strict';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CreationModule } from './creation.module';

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(CreationModule)
    .then(success => {
      console.log('Angular has been boostrapped.');
    })
    .catch(err => {
      console.error(err);
    });
});
