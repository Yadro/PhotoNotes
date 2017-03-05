import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
} from 'react-native';

type MdData = string | Type | Type[];
interface Type {
  type: 'simple' | 'bold' | 'italic' | 'item' | 'item-block';
  text: string;
  data: Type;
}

function flatArray(input) {
  return input.reduce(function(prev, cur) {
    let more = [].concat(cur).some(Array.isArray);
    return prev.concat(more ? flatArray(cur) : cur);
  },[]);
}

export const Markdown = {

  parse(text: string) {
    if (!text || !text.length) return;
    text = text.replace(/\n/g, '↵\n');
    let data = this.execType(text, this.findHeader2.bind(this));
    data = this.execType(data, this.findListItem2.bind(this));
    data = this.execType(data, this.findListBlock2.bind(this));
    data = this.execType(data, this.findHeader.bind(this));
    data = this.execType(data, this.findBold.bind(this));
    data = this.execType(data, this.findItalic.bind(this));

    if (Array.isArray(data)) {
      data = flatArray(data);
      data = data.map(e => {
        if (typeof e == "string") {
          return e.replace(/↵/g, '\n');
        } else if (typeof e == "object" && typeof e.text == "string") {
          e.text = e.text.replace(/↵/g, '\n');
          return e;
        }
        return e;
      });
    }
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

  findHeader(text) {
    return this.find(/\n# ([^\n#]+)/, 'header', text);
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
    if (out.length == 1) {
      return out[0];
    }
    return out;
  },

  findListItem2(text) {
    return this.findByLine(/^- ([\s\S]+)/, 'item', text);
  },

  findListBlock2(text) {
    return this.findByLine(/^  ([\s\S]+)/, 'item-block', text);
  },

  findHeader2(text) {
    return this.findByLine(/^# ([\s\S]+)/, 'header', text);
  },

  findByLine(reg, type, text: string) {
    const lines = text.split('\n');
    const out = lines.map(line => {
      const res = reg.exec(line);
      if (res) {
        return {
          type,
          text: res[1]
        }
      }
      return line;
    });
    if (out.length == 1) {
      return out[0];
    }
    return out;
  },

  createText(data: MdData, i?) {
    i = !i ? 0 : i++;
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
      const actions = {
        'bold': (value) => <TextBold key={i} value={value}/>,
        'italic': (value) => <TextItalic key={i} value={value}/>,
        'item': (value) => <List key={i} value={value}/>,
        'item-block': (value) => <ListBlock key={i} value={value}/>,
        'header': (value) => <ListHeader key={i} value={value}/>
      };
      return actions[data.type](value);
    }
  }
};

const MarkdownW = ({children}) => children;
const SimpleText = ({value}) => <Text>{value}</Text>;
const TextBold = ({value}) => <Text style={css.bold}>{value}</Text>;
const TextItalic = ({value}) => <Text style={css.italic}>{value}</Text>;
const TextU = ({value}) => <Text>{value}</Text>;
const List = ({value}) => <Text>{' •\t'}<Text>{value}</Text></Text>;
const ListBlock = ({value}) => <Text>{'\t'}<Text>{value}</Text></Text>;
const ListHeader = ({value}) => <Text style={css.header}>{value}</Text>;

const css = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  } as TextStyle,
  italic: {
    fontStyle: 'italic',
  } as TextStyle,
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  } as TextStyle
});