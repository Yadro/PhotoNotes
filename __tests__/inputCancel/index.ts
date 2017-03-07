import { InputCancel } from '../../build/src/InputCancel'
// const InputCancel = IP.InputCancel;

test('hello world', () => {
  const inputCancel = new InputCancel();

  let input = '';
  each('hello world', (symb) => {
    input += symb;
    inputCancel.updateState(input);
  });

  expect(inputCancel.history).toBe([{
    text: 'hello',
    pos: 0
  }, {
    text: ' world',
    pos: 4
  }]);
});

function each(text, fn) {
  for (let i = 0; i < text.length; i++) {
    fn(text[i], i, text);
  }
}

