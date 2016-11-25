var expect = require('chai').expect;

describe('Our first tests', function () {
  it('expect framework should be installed', function() {
    expect(expect).to.exist;
  });

  it('expect gimme1 to return 1', function() {
    expect(1).to.be.equal(1);
  });
});
