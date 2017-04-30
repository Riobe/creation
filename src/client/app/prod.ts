'use strict';

import '@angular/platform-browser';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';
import '@angular/forms';

import 'rxjs';

import { platformBrowser } from '@angular/platform-browser';
import { CreationModuleNgFactory } from './aot/src/client/app/creation.module.ngfactory';
import { enableProdMode } from '@angular/core';

enableProdMode();

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser().bootstrapModuleFactory(CreationModuleNgFactory);
});
