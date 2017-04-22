'use strict';

import { enableProdMode } from '@angular/core';
import { bootstrapApp } from './main';

document.addEventListener('DOMContentLoaded', () => {
  enableProdMode();
  bootstrapApp();
});
