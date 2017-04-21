// @flow
import hljs from 'highlight.js';
import styles from './styles.sss';

 class Markdup {
  // class properties
  mockDom: Array<Map<string, any>>;
  indents: Array<Map<string, any>>;
  domAsString: string;
  voidElements: Array<string>;
  noCustomErrors: ?boolean;
  numOfSpaces: ?number;
  indentLevel: number;
  indentation: string;
  innerHtmlStorage: Map<string, any>;
  hljs: Object;
  // function properties
  setSpaces: Function;
  createHiddenElement: Function;
  attachListener: Function;
  copyMarkup: Function;
  addCopyToDom: Function;
  manageTabs: Function;
  addToMockDom: Function;
  domToString: Function;
  parseHtml: Function;
  render: Function;

  constructor(hljs: Object, noCustomErrors: ?boolean = null, numOfSpaces: ?number = null) {
    this.mockDom = [];
    this.indents = [];
    this.domAsString = '';
    this.voidElements = [
      'input',
      'br',
      'comment',
      'img',
      'br',
      'link',
      'meta',
      'col',
      'area',
      'base',
      'track',
      'wbr',
      'menuitem',
    ];
    this.noCustomErrors = noCustomErrors;
    this.numOfSpaces = numOfSpaces;
    this.indentLevel = 0;
    this.indentation = '';
    this.innerHtmlStorage = new Map();
    this.hljs = hljs;
  }
}

// Add amount spaces passed in from constructor, or defaults to two spaces
Markdup.prototype.setSpaces = function() {
  if (Number.isInteger(this.numOfSpaces) && this.numOfSpaces > 0) {
    for (let s = 0; s < this.numOfSpaces; s++) {
      this.indentation += ' ';
    }
  } else {
    this.indentation = '  ';
  }
}

// Create hidden element for copying
Markdup.prototype.createHiddenElement = function() {
  const input: HTMLElement = document.createElement('textarea');
  input.setAttribute('id', 'copyText01adhza');
  input.styles = 'display: none';
  document.body.append(input);
  return input;
}

// Attach listener for copy clicks
Markdup.prototype.attachListener = function() {
  document.addEventListener('click', event => {
    event.preventDefault();
    if (event.target.className.includes('markdup__copy')) {
      event.srcElement.classList.toggle(styles['markdup__copy--clicked']);
      this.copyMarkup(event.srcElement.parentElement.dataset.markdupRender);
      setTimeout(() => {
        event.srcElement.classList.toggle(styles['markdup__copy--clicked']);
      }, 500);
    }
  });
}

Markdup.prototype.copyMarkup = function(element) {
  document.querySelectorAll('[data-markdup-get]');
  const text: HTMLElement = document.getElementById('copyText01adhza');
  text.value = this.innerHtmlStorage.get(element);
  text.select();
  return document.execCommand('copy');
}

// Create button element
Markdup.prototype.addCopyToDom = function() {
  const button = document.createElement('a');
  button.classList.add(styles['markdup__copy']);
  button.innerHTML = 'Copy';
  return button;
}

Markdup.prototype.manageTabs = function (type: string) {
  let match;
  let counter = 0;
  let spacing = this.indentation;
  if (this.indents.length === 1) {
    this.indentLevel = 1;
  }
  if (type === 'close') {
    this.indents.pop();
    match = --this.indentLevel;
  } else {
    match = this.indentLevel;
  }
  while (counter < match) {
    spacing += this.indentation;
    ++counter;
  }
  return spacing;
}

// Parses HTML to determine if a tag is open or closed
Markdup.prototype.addToMockDom = function(parsedElement: string, text: string) {
  const elementInfo = new Map();
  // Parses for comment
  if (parsedElement.match(/<!--/) || parsedElement.match(/-->/)) {
    elementInfo.set('elementName', 'comment');
  } else {
    // Sets name of elementInfo etc. div, p, span
    elementInfo.set('elementName', parsedElement.match(/[a-z]+/g)[0]);
  }
  elementInfo.set('element', parsedElement);
  // Check for elements that don't have a seperate closing tag
  if (this.voidElements.includes(elementInfo.get('elementName'))) {
    elementInfo.set('open', false);
  } else if (!parsedElement.includes('</')) {
    elementInfo.set('open', true);
  } else {
    elementInfo.set('open', false);
    elementInfo.set('text', text);
  }
  this.mockDom.push(elementInfo);
}

// Add dom element with tabs to string
Markdup.prototype.domToString = function() {
  this.domAsString = '';
  for (let i = 0; i < this.mockDom.length - 1; ++i) {
    const currElement = this.mockDom[i].get('elementName');
    // Adds open tags
    if (this.mockDom[i].get('open')) {
      // Checks if the next element is a close tag and doesn't increase indentation
      if (i === 0) {
        this.domAsString += `${this.mockDom[i].get('element')}\n`;
      } else if (
        !this.mockDom[i + 1].get('open') &&
        this.mockDom[i + 1].get('elementName') === currElement
      ) {
        this.domAsString += `${this.manageTabs()}${this.mockDom[i].get('element')}`;
      } else {
        this.domAsString += `${this.manageTabs()}${this.mockDom[i].get('element')}\n`;
        this.indents.push(this.indentLevel);
        this.indentLevel++;
      }
    } else if (
      this.voidElements.includes(this.mockDom[i].get('elementName'))
    ) {
      // Adds closing tags
      this.domAsString += `${this.manageTabs()}${this.mockDom[i].get('element')}\n`;
    } else if (!this.mockDom[i - 1].get('open')) {
      // Checks if the last element is closed and decreases indentation
      this.domAsString += `${this.manageTabs('close')}${this.mockDom[i].get('element')}\n`;
    } else {
      // Checks if the last element has the same name and adds innerText if available
      let innerText;
      this.mockDom[i].get('text') === undefined
        ? (innerText = '')
        : (innerText = this.mockDom[i].get('text'));
      this.domAsString += `${innerText}${this.mockDom[i].get('element')}\n`;
    }
  }
  // Add last element
  this.domAsString += this.mockDom[this.mockDom.length - 1].get('element');
}

Markdup.prototype.parseHtml = function(originalHtml: string) {
  let localHtml = originalHtml;
  let openBracket;
  let closeBracket;
  while (localHtml.includes('<')) {
    if (localHtml.trim().startsWith('<!--')) {
      openBracket = localHtml.indexOf('<!--');
      closeBracket = localHtml.indexOf('-->') + 2;
    } else {
      openBracket = localHtml.indexOf('<');
      closeBracket = localHtml.indexOf('>');
    }
    let words;
    // Checks if there is innerText following open element
    const containsText = /^\w+/g.test(
      localHtml.trim().substring(0, openBracket),
    );
    if (containsText) {
      words = localHtml.substring(0, openBracket).trim();
    }
    const parsedElem = localHtml.substring(openBracket, closeBracket + 1);
    this.addToMockDom(parsedElem, words);
    localHtml = localHtml.slice(closeBracket + 1);
  }
}

Markdup.prototype.render = function() {
  // Methods needed prior for all markdup elements
  // this is not access until methods are created
  this.setSpaces();
  this.attachListener();
  this.createHiddenElement();
  const markdupSelectors = document.querySelectorAll('[data-markdup-get]');
  markdupSelectors.forEach(element => {
    this.indentLevel = 0;
    this.indents = [];
    // add to array to reuse in click handler
    const renderTo = element.dataset.markdupGet;
    // Get pre element with mathcing data-markdup-render attribute
    const preElement = document.querySelector(
      `[data-markdup-render=${renderTo}]`,
    );
    preElement.style.position = 'relative';
    this.innerHtmlStorage.set('key', renderTo);
    const preChildren = Array.from(preElement.children);
    const codeElement = preChildren.find(
      ele => ele.nodeName.toLowerCase() === 'code',
    );
    this.parseHtml(element.innerHTML.trim());
    this.domToString();
    try {
      codeElement.innerText = this.domAsString;
      this.innerHtmlStorage.set(renderTo, `${this.domAsString}`);
      preElement.prepend(this.addCopyToDom());
      this.hljs.highlightBlock(codeElement);
    } catch (e) {
      if (e instanceof TypeError && !this.noCustomErrors) {
        console.log(
          'Looks like you may have attached an null/undefined value to data-markdup-render. Make sure data-markdup-render matches data-markdup-get.',
        );
        console.log(e);
      }
    }
  });
}

export default Markdup
