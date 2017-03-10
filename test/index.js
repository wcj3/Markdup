const mk = new Markdup.Init();
const initObject = {
  mockDom: [],
  indents: [],
  domAsString: '',
  noClosers: ['input', 'br', 'comment', 'img', 'br', 'link', 'meta', 'col', 'area', 'base', 'track', 'wbr', 'menuitem'],
  noCustomErrors: null,
  numOfSpaces: null,
  indentLevel: 0,
  spaces: '',
};


describe('Markdup Instantation', () => {
  it('Can properly instantiate', () => {
    expect(mk).not.toEqual(initObject);
  });
  it('Has valid properties', () => {
    expect(Object.keys(mk).length).toBeGreaterThan(1);
  });
});

describe('Markdup functions are legit', () => {
  it('Tabs function works', () => {
    mk.indentLevel = 8;
    mk.setSpaces();
    expect(mk.manageTabs()).toMatch(/\s+/);
  });
});

describe('DOM access is too legit', () => {
  it('Can access DOM through Karma', () => {
    expect(window.__html__['docs/index.html']).toBeDefined();
  })
})
