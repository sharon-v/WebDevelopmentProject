// test from cicd workshop
const expect = require('chai').expect;

describe('Array', () => {
  describe('#sort', () => {
    it('should sort the array by name', () => {
      const names = ['Dani', 'Moshe', 'Adam'];
      expect(names.sort()).to.be.eql(['Adam', 'Dani', 'Moshe']);
    });
  });
});
