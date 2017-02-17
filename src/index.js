import hljs from 'highlight.js';
import '../node_modules/highlight.js/styles/github.css';
// TODO: Add unit tests
"use strict";

class Markdup {

    //Declare instance variable

    constructor(){
        this.mockDom = [];
        this.indents = [];
        this.domAsString = "";
        this.noClosers = ['input', 'br', 'comment', 'img', 'br', 'link'];
    }

    //Parses HTML to determine if a tag is open or closed
    parseHTML(parsedElement, text) {
        const elementInfo = new Map();
        //Parses for comment
        if (parsedElement.match(/<!--/) || parsedElement.match(/-->/)) {
            elementInfo.set("elementName", "comment");
        }
        //Sets name of elementInfo etc. div, p, span
        else {
            elementInfo.set("elementName", parsedElement.match(/[a-z]+/g)[0]);
        }
        elementInfo.set("element", parsedElement);
        //Check for elements that don't have a seperate closing tag
        if (this.noClosers.includes(elementInfo.get("elementName"))) {
            elementInfo.set("open", false);
        } else if (!parsedElement.includes("</")) {
            elementInfo.set("open", true);
        } else {
            elementInfo.set("open", false);
            elementInfo.set("text", text);
        }
        this.mockDom.push(elementInfo);
    }

    //Add dom element with tabs to string
    appendToDom() {
        let indentLevel = 0;
        const manageTabs = (type) => {
            let match;
            let counter = 0;
            let tabs = "";
            if (this.indents.length === 1) {
                indentLevel = 1;
            }
            if (type === "close") {
                this.indents.pop();
                match = --indentLevel;
            } else {
                match = indentLevel;
            }
            while (counter < match) {
                tabs += "\t";
                counter++;
            }
            return tabs;
        };
        for (let i = 0; i < this.mockDom.length - 1; ++i) {
            const currElement = this.mockDom[i].get('elementName');
            //Adds open tags
            if (this.mockDom[i].get('open')) {
                //Checks if the next element is a close tag and doesn't increase indentation
                if (!this.mockDom[i + 1].get('open') && this.mockDom[i + 1].get('elementName') === currElement) {
                    this.domAsString += manageTabs() + this.mockDom[i].get('element');
                } else {
                    this.domAsString += manageTabs() + this.mockDom[i].get('element') + '\n';
                    this.indents.push(indentLevel);
                    indentLevel++;
                }
            }
            //Adds closing tags
            else {
                if (this.noClosers.includes(this.mockDom[i].get('elementName'))) {
                    this.domAsString += manageTabs() + this.mockDom[i].get('element') + '\n';
                } else {
                    //Checks if the last element is closed and decreases indentation
                    if (!this.mockDom[i - 1].get('open')) {
                        this.domAsString += manageTabs('close') + this.mockDom[i].get('element') + '\n';
                    }
                    //Checks if the last element has the same name and adds innerText if available
                    else {
                        let innerText;
                        this.mockDom[i].get('text') === undefined ? innerText = "" : innerText = this.mockDom[i].get('text');
                        this.domAsString += innerText + this.mockDom[i].get('element') + '\n';
                    }
                }
            }
        }
        //Add last element
        this.domAsString += this.mockDom[this.mockDom.length - 1].get('element');
    }

    render(){
        let originalHtml = document.getElementById('copy').innerHTML.trim().toString();
        let openBracket, closeBracket;

        //Add elements to mockDom
        while (originalHtml.includes("<")) {
            if (originalHtml.trim().startsWith("<!--")) {
                openBracket = originalHtml.indexOf("<!--");
                closeBracket = originalHtml.indexOf("-->") + 2;
            } else {
                openBracket = originalHtml.indexOf("<");
                closeBracket = originalHtml.indexOf(">");
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
        document.getElementById("markup").innerText = this.domAsString;
        hljs.initHighlightingOnLoad();
    }
}

const mk = new Markdup();
mk.render();
