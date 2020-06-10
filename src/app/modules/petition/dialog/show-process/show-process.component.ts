import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-process',
  templateUrl: './show-process.component.html',
  styleUrls: ['./show-process.component.scss']
})
export class ShowProcessComponent implements OnInit {

  processImage = '../../../../../assets/img/sample_process.png';

  constructor() { }

  ngOnInit(): void {
  }

}
