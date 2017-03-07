interface History {
  type;
  text;
  pos;
}

export class InputCancel {
  lastState: string;
  history: History[];
  lastEvent: History;

  updateState(text: string) {
    const change = this.findChange(text);
    this.history.push(change);
    this.lastEvent = change;
    this.lastState = text;
  }

  private findChange(text: string) {
    const {lastState} = this;
    let changeBegin, changeEnd;
    for (let i = 0; i < Math.min(lastState.length, text.length);) {
      if (text[i] != lastState[i]) {
        changeBegin = i;
        break;
      }
    }
    return {
      type: 'past',
      text: text.substring(changeBegin),
      pos: changeBegin
    }
  }
}

