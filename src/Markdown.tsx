import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type MdData = string | Type | Type[];
interface Type {
  type: 'simple' | 'bold' | 'italic' | 'item' | 'item-block';
  text: string;
  data: Type;
}

export const Markdown = {

  parse(text: string) {
    let data = this.execType(text, this.findLine.bind(this));
    data = this.execType(data, this.findBold.bind(this));
    data = this.execType(data, this.findItalic.bind(this));
    console.log(data);

    return <MarkdownW>{this.createText(data)}</MarkdownW>
  },

  execType(data: MdData, fn) {
    if (typeof data == "string") {
      return fn(data);
    } else if (Array.isArray(data)) {
      return data.map(e => this.execType(e, fn));
    } else if (typeof data == "object") {
      return {
        type: data.type,
        text: this.execType(data.text, fn),
      }
    }
  },

  findBold(text) {
    return this.find(/\*([^\n*]+)\*/, 'bold', text);
  },

  findItalic(text) {
    return this.find(/_([^\n_]+)_/, 'italic', text);
  },

  findListItem(text) {
    return this.findLine(text);
  },

  findLine(text: string) {
    const out = [];
    let loop = true;
    while (loop && text.length) {
      let loop2 = true;
      while (loop2 && text.length) {
        let res2 = /- ([^\n]+)\n/.exec(text);
        if (res2) {
          if (res2.index) {
            out.push(text.slice(0, res2.index));
          }
          out.push({
            type: 'item',
            text: res2[1],
          });
          text = text.slice(res2.index + res2[0].length);
        }
        loop2 = !!res2;
      }
      let res = /  ([^\n]+)\n/.exec(text);
      if (res) {
        if (res.index) {
          out.push(text.slice(0, res.index));
        }
        out.push({
          type: 'item-block',
          text: res[1],
        });
        text = text.slice(res.index + res[0].length);
      }
      loop = !!res;
    }
    if (!out.length) {
      return text;
    }
    if (text.length) {
      out.push(text);
    }
    return out;
  },

  find(reg, type, text: string) {
    const out = [];
    let loop = true;
    while (loop && text.length) {
      let res = reg.exec(text);
      if (res) {
        out.push(text.slice(0, res.index));
        out.push({
          type: type,
          text: res[1],
        });
        text = text.slice(res.index + res[0].length);
      } else {
        loop = false;
      }
    }
    if (!out.length) {
      return text;
    }
    if (text.length) {
      out.push(text);
    }
    return out;
  },

  createText(data: MdData, i?) {
    if (i == null) {
      i = 0;
    }
    i++;
    if (typeof data == "string") {
      // console.log(data);
      return <SimpleText key={i} value={data}/>
    } else if (Array.isArray(data)) {
      return <Text key={i}>{data.map(this.createText.bind(this))}</Text>;
    } else if (typeof data == "object") {
      let value;
      if (typeof data.text == "string") {
        value = data.text;
      } else {
        value = this.createText.call(this, data.text, i);
      }
      // console.log(value);
      const actions = {
        'bold': (value) => <TextBold key={i} value={value}/>,
        'italic': (value) => <TextItalic key={i} value={value}/>,
        'item': (value) => <List key={i} value={value}/>,
        'item-block': (value) => <ListBlock key={i} value={value}/>,
      };
      return actions[data.type](value);
    }
  }
};

const MarkdownW = ({children}) => children;
const SimpleText = ({value}) => <Text>{value}</Text>;
const TextBold = ({value}) => <Text style={css.bold}>{value}</Text>;
const TextItalic = ({value}) => <Text style={css.italic}>{value}</Text>;
const List = ({value}) => <Text>{'\n • '}<Text>{value}</Text></Text>;
const ListBlock = ({value}) => <Text>{'\n   '}<Text>{value}</Text></Text>;
const TextU = ({value}) => <Text style={css.bold}>{value}</Text>;

const css = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});