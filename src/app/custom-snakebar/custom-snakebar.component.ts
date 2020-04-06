import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snakebar',
  templateUrl: './custom-snakebar.component.html',
  styleUrls: ['./custom-snakebar.component.scss']
})
export class CustomSnakebarComponent implements OnInit {

  constructor(public snackBarRef: MatSnackBarRef<CustomSnakebarComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }
}
