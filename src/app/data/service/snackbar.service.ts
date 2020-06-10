import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/shared/components/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, content: string, result: string, reason: string, panelClass: string) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
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
