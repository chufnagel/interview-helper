var expect = require('chai').expect;
var myApi = require('../../server/index.js');

describe('Our first tests', function () {
  it('expect framework should be installed', function() {
    expect(expect).to.exist;
  });

  it('expect gimme1 to return 1', function() {
    expect(1).to.be.equal(1);
  });
});
