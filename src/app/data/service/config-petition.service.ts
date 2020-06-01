import { Injectable } from '@angular/core';

@Injectable()
export class ConfigPetitionService {

  constructor() { }

  formErrorMessage(id: number) {
    switch (id) {
      case 1:
        return 'Vui lòng nhập tên quy trình';
      case 2:
        return 'Vui lòng chọn chuyên mục';
      case 3:
        return 'Vui lòng chọn đơn vị';
      default:
        return 'You must enter a valid value';
    }
  }
}
