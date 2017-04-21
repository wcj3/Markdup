const initObject = {
  mockDom: [],
  indents: [],
  domAsString: '',
  noClosers: ['input', 'br', 'comment', 'img', 'br', 'link', 'meta', 'col', 'area', 'base', 'track', 'wbr', 'menuitem'],
  noCustomErrors: null,
  numOfSpaces: null,
  indentation: '',
  innerHtmlStorage: new Map()
};


describe('Markdup Instantation', () => {
  const mk = new Markdup();
  it('Can properly instantiate', () => {
    expect(mk).not.toEqual(initObject);
  });

  it('Has valid properties', () => {
    expect(Object.keys(mk).length).toBeGreaterThan(1);
  });
});

describe('Markdup functions work as expected', () => {
  it('Tabs function works', () => {
    const mk = new Markdup;
    mk.indentLevel = 8;
    mk.setSpaces();
    expect(mk.manageTabs()).toMatch(/\s+/);
  });
});

describe('Markdup DOM access', () => {
  it('Can access DOM through Karma', () => {
    expect(window.__html__['docs/index.html']).toBeDefined();
  })
})
