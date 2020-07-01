export interface PetitionElement {
  STT: number;
  id: string;
  title: string;
  topic: string;
  date: string;
  place: string;
  status: string;
}

export interface Comments {
  name: string;
  time: string;
  children?: Comments[];
}

export const TREE_DATA: Comments[] = [
  {
    name: 'Nguyễn Văn A',
    time: '13/12/2019 12:30:00',
    children: [
      {
        name: 'Nhờ cơ quan chức năng sớm xử lý phản ánh trên',
        time: ''
      }
    ]
  },
  {
    name: 'Nguyễn Văn B',
    time: '13/12/2019 16:00:00',
    children: [
      {
        name: 'Rất mong cơ quan chức năng vào cuộc để sớm xử lý phản ánh trên',
        time: ''
      }
    ]
  }
];
