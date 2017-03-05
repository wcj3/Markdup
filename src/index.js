import hljs from 'highlight.js';
import '../node_modules/highlight.js/styles/github.css';


export class init {

  constructor(noCustomErrors = null, numOfSpaces = null) {
    this.mockDom = [];
    this.indents = [];
    this.domAsString = '';
    this.noClosers = ['input', 'br', 'comment', 'img', 'br', 'link', 'meta', 'col', 'area', 'base', 'track', 'wbr', 'menuitem'];
    this.noCustomErrors = noCustomErrors;
    this.numOfSpaces = numOfSpaces;
  }

  // TODO: add clipboard JS

  // Parses HTML to determine if a tag is open or closed
  parseHTML(parsedElement, text) {
    const elementInfo = new Map();
    // Parses for comment
    if (parsedElement.match(/<!--/) || parsedElement.match(/-->/)) {
      elementInfo.set('elementName', 'comment');
    }
    // Sets name of elementInfo etc. div, p, span
    else {
      elementInfo.set('elementName', parsedElement.match(/[a-z]+/g)[0]);
    }
    elementInfo.set('element', parsedElement);
    // Check for elements that don't have a seperate closing tag
    if (this.noClosers.includes(elementInfo.get('elementName'))) {
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
  appendToDom() {
    this.domAsString = '';
    let indentLevel = 0;
    let spaces = '';
    // Add amount spaces passed in from constructor, or defaults to two spaces
    if (Number.isInteger(this.numOfSpaces) && this.numOfSpaces > 0) {
      for (let s = 0; s < this.numOfSpaces; s++) {
        spaces += ' ';
      }
    } else {
      spaces = '  ';
    }
    const manageTabs = (type) => {
      let match;
      let counter = 0;
      let tabs = '';
      if (this.indents.length === 1) {
        indentLevel = 1;
      }
      if (type === 'close') {
        this.indents.pop();
        match = --indentLevel;
      } else {
        match = indentLevel;
      }
      while (counter < match) {
        tabs += spaces;
        counter++;
      }
      return tabs;
    };
    for (let i = 0; i < this.mockDom.length - 1; ++i) {
      const currElement = this.mockDom[i].get('elementName');
      // Adds open tags
      if (this.mockDom[i].get('open')) {
        // Checks if the next element is a close tag and doesn't increase indentation
        if (!this.mockDom[i + 1].get('open') && this.mockDom[i + 1].get('elementName') === currElement) {
          this.domAsString += `${manageTabs()} ${this.mockDom[i].get('element')}`;
        } else {
          this.domAsString += `${manageTabs()} ${this.mockDom[i].get('element')} \n`;
          this.indents.push(indentLevel);
          indentLevel++;
        }
      }
      // Adds closing tags
      else if (this.noClosers.includes(this.mockDom[i].get('elementName'))) {
        this.domAsString += `${manageTabs()}  ${this.mockDom[i].get('element')} \n`;
      } else if (!this.mockDom[i - 1].get('open')) {
        // Checks if the last element is closed and decreases indentation
        this.domAsString += `${manageTabs('close')} ${this.mockDom[i].get('element')} \n`;
      }
      // Checks if the last element has the same name and adds innerText if available
      else {
        let innerText;
        this.mockDom[i].get('text') === undefined ? innerText = '' : innerText = this.mockDom[i].get('text');
        this.domAsString += `${innerText}  ${this.mockDom[i].get('element')} \n`;
      }
    }
    // Add last element
    this.domAsString += this.mockDom[this.mockDom.length - 1].get('element');
  }

  render() {
    let originalHtml;
    const markdupSelectors = document.querySelectorAll('[data-markdup-get]');
    markdupSelectors.forEach((element) => {
      const renderTo = element.dataset.markdupGet;
      originalHtml = element.innerHTML.trim().toString();
      const matchedMarkdup = document.querySelector(`[data-markdup-render=${renderTo}]`);
      let openBracket;
      let closeBracket;
      // Add elements to mockDom
      while (originalHtml.includes('<')) {
        if (originalHtml.trim().startsWith('<!--')) {
          openBracket = originalHtml.indexOf('<!--');
          closeBracket = originalHtml.indexOf('-->') + 2;
        } else {
          openBracket = originalHtml.indexOf('<');
          closeBracket = originalHtml.indexOf('>');
        }
        let words;
        const containsText = /^\w+/g.test(originalHtml.trim().substring(0, openBracket));
        if (containsText) {
          words = originalHtml.substring(0, openBracket).trim();
        }
        const parsedElem = originalHtml.substring(openBracket, closeBracket + 1);
        this.parseHTML(parsedElem, words);
        originalHtml = originalHtml.slice(closeBracket + 1);
      }
      this.appendToDom();
      try {
        matchedMarkdup.innerText = this.domAsString;
        hljs.highlightBlock(matchedMarkdup);
      } catch (e) {
        if (e instanceof TypeError && !this.noCustomErrors) {
          console.log('Looks like you may have attached an null/undefined value to data-markdup-render. Make sure data-markdup-render matches data-markdup-get.');
          console.log(e);
        }
      }
    });
  }
}
