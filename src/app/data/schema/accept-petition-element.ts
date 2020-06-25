export interface AcceptPetitionElement {
  no: number;
  id: string;
  title: string;
  tag: string;
  createDate: string;
  takePlaceAt: string;
  status: string;
}

export interface Comments {
  name: string;
  time: string;
  children?: Comments[];
}

export const PETITION_DATA: AcceptPetitionElement[] = [
  {no: 1, id: '5df0bb5e87fef8d603251dd0', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {no: 2, id: '5df0bb5e87fef8d603251dd1', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {no: 3, id: '5df0bb5e87fef8d603251dd2', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 4, id: '5df0bb5e87fef8d603251dd3', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {no: 5, id: '5df0bb5e87fef8d603251dd4', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận'},
  {no: 6, id: '5df0bb5e87fef8d603251dd5', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 7, id: '5df0bb5e87fef8d603251dd6', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 8, id: '5df0bb5e87fef8d603251dd7', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 9, id: '5df0bb5e87fef8d603251dd8', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 10, id: '5df0bb5e87fef8d603251dd9', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 11, id: '5df97cf9f2500017acaf8889', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 12, id: '5df97cf9f2500017acaf8888', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 13, id: '5df97cf9f2500017acaf8887', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 14, id: '5df97cf9f2500017acaf8886', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 15, id: '5df97cf9f2500017acaf8885', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 16, id: '5df97cf9f2500017acaf8884', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 17, id: '5df97cf9f2500017acaf8883', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 18, id: '5df97cf9f2500017acaf8882', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 19, id: '5df97cf9f2500017acaf8881', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'},
  {no: 20, id: '5df97cf9f2500017acaf8880', title: 'Phản ánh về trật tự đô thị', tag: 'Giao thông, y tế', createDate: '12/12/2019',
    takePlaceAt: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Đã tiếp nhận'}
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
