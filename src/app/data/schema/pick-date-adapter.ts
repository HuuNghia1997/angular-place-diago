import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
