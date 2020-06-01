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

export const PETITION_DATA: PetitionElement[] = [
  {STT: 1, id: '5df0bb5e87fef8d603251dd0', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ nhận xử lý'},
  {STT: 2, id: '5df0bb5e87fef8d603251dd1', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ xử lý'},
  {STT: 3, id: '5df0bb5e87fef8d603251dd2', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 4, id: '5df0bb5e87fef8d603251dd3', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ xử lý'},
  {STT: 5, id: '5df0bb5e87fef8d603251dd4', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ nhận xử lý'},
  {STT: 6, id: '5df0bb5e87fef8d603251dd5', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 7, id: '5df0bb5e87fef8d603251dd6', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 8, id: '5df0bb5e87fef8d603251dd7', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 9, id: '5df0bb5e87fef8d603251dd8', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 10, id: '5df0bb5e87fef8d603251dd9', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 11, id: '5df97cf9f2500017acaf8889', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 12, id: '5df97cf9f2500017acaf8888', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 13, id: '5df97cf9f2500017acaf8887', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 14, id: '5df97cf9f2500017acaf8886', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 15, id: '5df97cf9f2500017acaf8885', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 16, id: '5df97cf9f2500017acaf8884', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 17, id: '5df97cf9f2500017acaf8883', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 18, id: '5df97cf9f2500017acaf8882', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 19, id: '5df97cf9f2500017acaf8881', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {STT: 20, id: '5df97cf9f2500017acaf8880', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'}
];

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
