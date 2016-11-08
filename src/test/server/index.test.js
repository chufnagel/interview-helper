var expect = require('chai').expect;

describe('Our first tests', function () {
  it('expect framework should be installed', function() {
    expect(expect).to.exist;
  });
});