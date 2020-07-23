export interface Language {
  id: string;
  lang: string;
  urlsIcon: string;
  value: string;
}

export const LANGUAGE_DATA: Language[] = [
  {
    id: '1',
    lang: 'Tiếng Việt',
    urlsIcon: './assets/icon/VI.png',
    value: 'vi'
  },
  {
    id: '2',
    lang: 'Tiếng Anh',
    urlsIcon: './assets/icon/EN.png',
    value: 'en'
  }
];
