import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomPopupComponent } from 'src/app/shared/components/custom-popup/custom-popup.component';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, content: string, result: string, reason: string, panelClass: string) {
    this.snackBar.openFromComponent(CustomPopupComponent, {
      data: {
        ms: message + '<b> ' + content + '</b> ' + result + reason
      },
      panelClass,
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
}
