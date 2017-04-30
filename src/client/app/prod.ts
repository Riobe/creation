'use strict';

import '@angular/platform-browser';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';
import '@angular/forms';

import 'rxjs';

import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './aot/src/client/app/app.module.ngfactory';
import { enableProdMode } from '@angular/core';

enableProdMode();

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
});
