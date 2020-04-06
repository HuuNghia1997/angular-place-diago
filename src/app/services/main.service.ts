import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnakebarComponent } from '../custom-snakebar/custom-snakebar.component';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    constructor(private snackBar: MatSnackBar) { }

    openSnackBar(message: string, content: string, result: string, reason: string, panelClass: string) {
        this.snackBar.openFromComponent(CustomSnakebarComponent, {
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
