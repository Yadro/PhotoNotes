import * as React from 'react';
import {Text, TextStyle, StyleSheet, View} from 'react-native';
import {defaultBlockParse} from 'simple-markdown';

type InlineType = 'text' | 'em' | 'u' |  'strong' | 'del' | 'link' | 'url' | 'mailto';
type BlickType = 'newline' | 'paragraph' | 'heading' | 'list' | 'blockQuote';
interface IMarkdownItem {
  type: InlineType | BlickType;
  content?: string | IMarkdownItem[];
  items?: IMarkdownItem[][];
  target?: string; // link type
  title?: string; // link type
  start?; // list type
  ordered?: boolean;  // list type
}


export function parse(text) {
  let data = defaultBlockParse(text);
  console.log(data);
  return generate(data);
}

function generate(data: IMarkdownItem[]) {
  return data.map((e, idx) => createElement(e, {idx}));
}

function createElement(el: string | IMarkdownItem | IMarkdownItem[] | IMarkdownItem[][], data) {
  if (typeof el === "string") {
    return el;
  }
  if (Array.isArray(el)) {
    return el.map((e, idx) => {
      data.idx = idx;
      return createElement(e, data);
    });
  }
  const id = data.idx;
  data.idx++;
  switch (el.type) {
    case 'text':
      return <SimpleText key={id} value={el.content}/>;
    case 'u':
      return <TextItalic key={id} value={createElement(el.content, data)}/>;
    case 'em':
      return <TextItalic key={id} value={createElement(el.content, data)}/>;
    case 'del':
      return <TextItalic key={id} value={createElement(el.content, data)}/>;
    case 'strong':
      return <TextBold key={id} value={createElement(el.content, data)}/>;
    case 'newline':
      return <SimpleText key={id} value={'\n'}/>;
    case 'link':
    case 'mailto':
    case 'url':
      return <Link key={id} value={createElement(el.content, data)}/>;
    case 'heading':
      return <Header key={id} value={createElement(el.content, data)}/>;
    case 'paragraph':
      return <SimpleText key={id} value={createElement(el.content, data)}/>;
    case 'list':
      data.list = true;
      return <View key={id} style={{paddingLeft: 5}}>{createElement(el.items, data)}</View>;
    case 'blockQuote':
      return <View key={id} style={{paddingLeft: 5, borderLeftWidth: 1, borderColor: 'grey'}}>
        {createElement(el.content, data)}
      </View>;
  }
}

const SimpleText = ({value}) => <Text>{value}</Text>;
const TextBold = ({value}) => <Text style={css.bold}>{value}</Text>;
const TextItalic = ({value}) => <Text style={css.italic}>{value}</Text>;
const TextUnderline = ({value}) => <Text style={css.underline}>{value}</Text>;
const Link = ({value}) => <Text style={css.link}>{value}</Text>;
const List = ({value}) => <Text>{' •\t'}<Text>{value}</Text></Text>;
const ListBlock = ({value}) => <Text>{'\t'}<Text>{value}</Text></Text>;
const Header = ({value}) => <Text style={css.header}>{value}</Text>;


const css = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  } as TextStyle,
  italic: {
    fontStyle: 'italic',
  } as TextStyle,
  underline: {
    textDecorationLine: 'underline',
  } as TextStyle,
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  } as TextStyle,
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  } as TextStyle,
});