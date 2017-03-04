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

    // return this.createText(data);
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

  createText(data: MdData) {
    if (typeof data == "string") {
      return <SimpleText value={data}/>
    } else if (Array.isArray(data)) {
      const res = [];
      console.log(data);
      const out = data.map(this.createText);
      for (let i = 0; i < out.length; i++) {
        let data = out[i];
        if (Array.isArray(data)) {
          res.push(...data);
        } else {
          res.push(data);
        }
      }
      return <Text>{res}</Text>;
    } else if (typeof data == "object") {
      if (data.type == 'bold') {
        return <TextBold value={data.text}/>
      } else if (data.type == 'italic') {
        return <TextItalic value={data.text}/>
      }
    }
  }
};

const SimpleText = ({value}) => <Text>{value}</Text>;
const TextBold = ({value}) => <Text style={css.bold}>{value}</Text>;
const TextItalic = ({value}) => <Text style={css.italic}>{value}</Text>;
const TextU = ({value}) => <Text style={css.bold}>{value}</Text>;

const css = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});