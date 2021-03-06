import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-process',
  templateUrl: './show-process.component.html',
  styleUrls: ['./show-process.component.scss']
})
export class ShowProcessComponent implements OnInit {

  processInstanceId: string;
  status: number;
  workflowName: any;
  svgIcon: any;

  constructor(public dialogRef: MatDialogRef<ShowProcessComponent>,
              private service: PetitionService,
              @Inject(MAT_DIALOG_DATA) public data: ShowProcessDialogModel,
              private sanitizer: DomSanitizer) {
    this.processInstanceId = data.processInstanceId;
  }

  ngOnInit(): void {
    this.getModel();
  }

  getModel() {
    this.service.getModel(this.processInstanceId).subscribe(model => {
      const blob = new Blob([model], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      this.svgIcon = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

}

export class ShowProcessDialogModel {
  constructor(public title: string,
              public processInstanceId: string) {
  }
}
