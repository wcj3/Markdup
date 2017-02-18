describe("Markdup Instantation", function() {
    const mk = new Markdup.Markdup();
    it("Can properly instantiate", function() {
        expect(mk).not.toBe(null);
    });
    it("Has valid properties", function() {
        expect(Object.keys(mk).length).toBeGreaterThan(1);
    });
});
