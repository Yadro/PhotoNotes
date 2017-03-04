import * as React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

type MdData = string | Type | Type[];
interface Type {
  type: 'simple' | 'bold' | 'italic';
  text: string;
  data: Type;
}

export const Markdown = {

  parse(text: string) {

    // debugger;
    let data = this.execType(text, this.findBold.bind(this));
    data = this.execType(data, this.findItalic.bind(this));
    // data = this.execType(data, this.findItalic.bind(this));
    console.log(data);

    return <MarkdownW>{this.createText(data)}</MarkdownW>
  },

  execType(data: MdData, fn) {
    if (typeof data == "string") {
      return fn(data);
    } else if (Array.isArray(data)) {
      return data.map(e => this.execType(e, fn));
    } else if (typeof data == "object") {
      const res = fn(data.text);

      return {
        type: data.type,
        text: res,
      }
    }
  },

  findBold(text) {
    return this.find(/\*([\w\s]+)\*/, 'bold', text);
  },

  findItalic(text) {
    return this.find(/_([\w\s]+)_/, 'italic', text);
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
      if (data.type == 'bold') {
        return <TextBold key={i} value={value}/>
      } else if (data.type == 'italic') {
        return <TextItalic key={i} value={value}/>
      }
    }
  }
};

const MarkdownW = ({children}) => children;
const SimpleText = ({key, value}) => <Text key={key}>{value}</Text>;
const TextBold = ({key, value}) => <Text key={key} style={css.bold}>{value}</Text>;
const TextItalic = ({key, value}) => <Text key={key} style={css.italic}>{value}</Text>;
const TextU = ({key, value}) => <Text key={key} style={css.bold}>{value}</Text>;

const css = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});