export interface AllPetitionElement {
    num: number;
    id: string;
    title: string;
    topic: string;
    date: string;
    place: string;
    status: string;
    processInstanceId: string;
  }
  
  export interface Comments {
    name: string;
    time: string;
    children?: Comments[];
  }
  
  export const PETITION_DATA: AllPetitionElement[] = [
    {num: 1, id: '5df0bb5e87fef8d603251dd0', title: 'Phản ánh về trật tự đô thị 2', topic: 'Giao thông, y tế', date: '12/12/2019',
      place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận', processInstanceId: ""},
    {num: 2, id: '5df0bb5e87fef8d603251dd1', title: 'Phản ánh về trật tự đô thị', topic: 'Giao thông, y tế', date: '12/12/2019',
      place: 'số 123, Ấp bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang', status: 'Chờ tiếp nhận', processInstanceId: ""}
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
  