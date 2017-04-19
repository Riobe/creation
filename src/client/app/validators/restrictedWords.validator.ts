'use strict';

import { FormControl } from '@angular/forms';

export function restrictedWords(words: string[]) {
  return (control: FormControl) => {
    if (!words) { return null; }

    const invalidWords = words.filter(word => control.value.includes(word));
    return invalidWords.length ?
      { restrictedWords: invalidWords.join(',') } :
      null;
  };
}
