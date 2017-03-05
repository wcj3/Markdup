import Benchmark from 'benchmark';

const suite = new Benchmark().Suite;

describe("Markdup Instantation", function() {
  const mk = new Markdup.init();
  it("Can properly instantiate", function() {
    expect(mk).not.toBe(null);
  });
  it("Has valid properties", function() {
    expect(Object.keys(mk).length).toBeGreaterThan(1);
  });
});
