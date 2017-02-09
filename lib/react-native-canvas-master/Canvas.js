'use strict';

var React = require('react');
var {
  View,
  WebView
} = require('react-native');

var Canvas = React.createClass({

  propTypes: {
    context: React.PropTypes.object,
    render: React.PropTypes.func.isRequired
  },

  render() {

    var contextString = JSON.stringify(this.props.context);
    var renderString = this.props.render.toString();

    var html = "<style>*{margin:0;padding:0;}canvas{position:absolute;transform:translateZ(0);}</style>" +
      "<canvas></canvas><img/>" +
      "<script>var canvas = document.getElementsByTagName('canvas')[0];" +
      "var image = document.getElementsByTagName('img')[0];" +
      "(" + renderString + ").call(" + contextString + ", canvas, image, document, window);</script>";
    return (
      <View>
        <WebView
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
          source={{html:html}}
          opaque={false}
          underlayColor={'transparent'}
          style={this.props.style}
        />
      </View>
    );
  }
});

module.exports = Canvas;
