import React, {Component, cloneElement} from 'react';
import {} from 'react-native';

// TODO управление компонентом SimpleRouter снаружи
// например экран настроек, где слева категории, а справа компоненты
export class SimpleRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routers: props.routers,
      current: props.current || props.routers.index,
      sendProps: {}
    };
    [
      'go',
      'injectGo'
    ].forEach(fn => this[fn] = this[fn].bind(this));
  }

  componentWillMount() {
    console.log(this, 'componentWillMount');
  }

  componentWillReceiveProps(nextProps) {
    console.log(this, 'componentWillReceiveProps');
  }

  go(toRouter: string, params?: Object) {
    let currentElement;
    const routers = this.state.routers;
    if (routers[toRouter]) {
      currentElement = routers[toRouter];
    }
    return () => {
      if (currentElement) {
        this.setState({
          current: currentElement,
          sendProps: params || {}
        });
      } else {
        console.error(`SimpleRouter: Router '${toRouter}' not found`);
      }
    };
  }

  injectGo(props) {
    props = props || {};
    props['go'] = this.go;
    return props;
  }

  render() {
    const {sendProps, current} = this.state;
    return cloneElement(current, this.injectGo(sendProps));
  }
}
