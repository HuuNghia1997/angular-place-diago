import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgxMatNativeDateAdapter } from '@angular-material-components/datetime-picker';

@Injectable()
export class PickDatetimeAdapter extends NgxMatNativeDateAdapter {
  format(date: Date, displayFormat): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy HH:mm:ss', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
