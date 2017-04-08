
export default {
  NoteList: {
    toolbar: {
      search: 'Поиск',
      menu: 'Меню',
      remove: 'Удалить',
    },
    sortName: 'Сортировка по алфавиту',
    sortCreate: 'Сортировка дате создания',
    sortEdit: 'Сортировка по изменению',
    about: 'About',
  },
  Search: {
    toolbar: {
      header: 'Фильтр заметок',
    },
    window: {
      search: 'Найти',
    }
  },
  NoteView: {
    toolbar: {
      header: 'Заметка',
      edit: 'Редактировать',
      share: 'Поделиться',
      del: 'Удалить',
    },
  },
  NoteEdit: {
    toolbar: {
      header: 'Редактировать',
      picker: 'Пркрепить фото',
      share: 'Поделиться',
      remove: 'Удалить',
    },
    window: {
      title: 'Заголовок',
      content: 'Введите содержимое',
    },
    editor: {
      past: 'Вставить',
      timestamp: 'Время',
      bold: 'Полужирный',
      italic: 'Курсив',
      underline: 'Подчеркнутый',
      list: 'Список',
      header: 'Заголовок',
    }
  },
  Threshold: {
    toolbar: {
      header: 'Обработка',
      ok: 'Добавить',
    }
  },
  Alert: {
    remove: {
      title: 'Удаление',
      subtitle: 'Удалить заметку?',
      buttons: {
        cancel: 'Отмена',
        remove: 'Удалить'
      }
    },
    removeMulti: {
      title: 'Удаление',
      subtitle: (n) => `Удалить заметки (${n})?`,
      buttons: {
        cancel: 'Отмена',
        remove: 'Удалить'
      }
    }
  },

  // EditFilter
  Filter: {
    title: 'Фильтр',
    titleInput: 'Заголовок',
    filterType: 'Тип фильтра',
    selectTag: 'Теги',
    addNewTag: 'Добавить новый тег (enter)',
    alert: {
      title: 'Проверьте правильность ввода',
      content: 'Заголовок должен быть заполнен и выбран хотя бы один тег (только в white list)',
    }
  },

  // NavigationDrawer
  DrawerMenu: {
    title: 'Edditr',
    buttons: {
      addFilter: 'Добавить фильтр',
      settings: 'Настройки',
    }
  },

  sayHi: {
    prefix: 'Добрый',
    day: [
      'Доброе утро',
      'Добрый день',
      'Добрый вечер',
      'Доброй ночи',
    ]
  }
}
