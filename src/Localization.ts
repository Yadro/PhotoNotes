
export default {
  NoteList: {
    toolbar: {
      search: 'Поиск',
      menu: 'Меню',
      remove: 'Удалить',
    },
    sortName: 'Сортировка по названию',
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
  }
}
