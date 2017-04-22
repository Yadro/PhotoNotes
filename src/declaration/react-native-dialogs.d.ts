declare module 'react-native-dialogs' {
  type MultiChoiceCallback = (indices: number[], selected: string[]) => any;
  type ChoiceCallback = (indices: number, selected: string) => any;
  interface DialogOptions {
    title?: string;
    content?: string;
    items?: string[];
    selectedIndex?: number;
    itemsCallback?: MultiChoiceCallback;
    itemsCallbackSingleChoice?: ChoiceCallback;
    itemsCallbackMultiChoice?: MultiChoiceCallback;

    input?: {
      prefill?: string;
      callback?: (choose: number) => void;
    }

    positiveText?: string;
    negativeText?: string;
    neutralText?: string;
  }
  export default class {
    set(options: DialogOptions): void;
    show(): void;
  }
}
