import * as React from 'react';
import {Text, TextStyle, StyleSheet, View, ViewStyle} from 'react-native';
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
    return (el as IMarkdownItem[]).map((e, idx) => {
      data.idx = idx;
      if (data.list) {
        if (e.type === 'list') {
          return <View key={idx} style={css.listItem}>
            {createElement(e, data)}
          </View>
        }
        return <View key={idx} style={css.listItem}>
          <ListCircle/>{createElement(e, data)}
        </View>
      }
      return createElement(e, data);
    });
  }
  if (data.list === true) {
    data = Object.assign({}, data, {list: false});
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
      return <View key={id} style={{paddingLeft: 8}}>{createElement(el.items, data)}</View>;
    case 'blockQuote':
      return <View key={id} style={css.quote}>
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
const ListCircle = () => <View style={css.circle}/>;

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
  quote: {
    paddingLeft: 4,
    borderLeftWidth: 2,
    borderColor: 'grey',
    marginVertical: 2,
    paddingVertical: 2,
  },
  listItem: {

  },
  circle: {
    position: 'absolute',
    top: 9,
    left: -7,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'grey',
  } as ViewStyle
});