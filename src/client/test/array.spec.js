'use strict';

const expect = require('chai').expect;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', () => {
      let array = [1,2,3];

      let result = array.indexOf(4);

      expect(result).to.equal(-1);
    });
  });
});

