export interface AcceptPetitionElement {
  num: number;
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

export const PETITION_DATA: AcceptPetitionElement[] = [
  {num: 1, id: '5df0bb5e87fef8d603251dd0', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {num: 2, id: '5df0bb5e87fef8d603251dd1', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {num: 3, id: '5df0bb5e87fef8d603251dd2', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 4, id: '5df0bb5e87fef8d603251dd3', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {num: 5, id: '5df0bb5e87fef8d603251dd4', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {num: 6, id: '5df0bb5e87fef8d603251dd5', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 7, id: '5df0bb5e87fef8d603251dd6', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 8, id: '5df0bb5e87fef8d603251dd7', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 9, id: '5df0bb5e87fef8d603251dd8', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 10, id: '5df0bb5e87fef8d603251dd9', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 11, id: '5df97cf9f2500017acaf8889', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 12, id: '5df97cf9f2500017acaf8888', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 13, id: '5df97cf9f2500017acaf8887', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 14, id: '5df97cf9f2500017acaf8886', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 15, id: '5df97cf9f2500017acaf8885', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 16, id: '5df97cf9f2500017acaf8884', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 17, id: '5df97cf9f2500017acaf8883', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 18, id: '5df97cf9f2500017acaf8882', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 19, id: '5df97cf9f2500017acaf8881', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
    place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {num: 20, id: '5df97cf9f2500017acaf8880', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
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
