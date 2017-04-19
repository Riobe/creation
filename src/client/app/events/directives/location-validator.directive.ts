'use strict';

import { Directive } from '@angular/core';
import { Validator, FormGroup, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateLocation]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: LocationValidator,
    multi: true
  }]
})
export class LocationValidator implements Validator {
  public validate(formGroup: FormGroup) {
    const addressControl = formGroup.get('address'),
          cityControl = formGroup.get('city'),
          countryControl = formGroup.get('country'),
          onlineUrlControl = formGroup.root.get('onlineUrl');

    const filledOut = control => control && control.value;

    const allAddress = filledOut(addressControl) && filledOut(cityControl) && filledOut(countryControl),
          anyAddress = filledOut(addressControl) || filledOut(cityControl) || filledOut(countryControl),
          hasUrl = filledOut(onlineUrlControl);

    if (hasUrl && !anyAddress) {
      return null;
    }

    if (!hasUrl && allAddress) {
      return null;
    }

    return { validateLocation: false };
  }
}
