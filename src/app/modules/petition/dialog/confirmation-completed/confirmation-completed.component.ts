import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation-completed',
  templateUrl: './confirmation-completed.component.html',
  styleUrls: ['./confirmation-completed.component.scss']
})
export class ConfirmationCompletedComponent implements OnInit {

  isLinear = true;
  checkedStep1: string;
  checkedStep2 = false;
  submit = 2;

  constructor() { }

  ngOnInit(): void {
  }

}
