import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllPetitionService } from 'src/app/data/service/all-petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-process-all-petition',
  templateUrl: './show-process-all-petition.component.html',
  styleUrls: ['./show-process-all-petition.component.scss']
})
export class ShowProcessAllPetitionComponent implements OnInit {

  workflowId: string;
  status: number;
  workflowName: any;
  svgIcon: any;

  constructor(public dialogRef: MatDialogRef<ShowProcessAllPetitionComponent>,
              private service: AllPetitionService,
              @Inject(MAT_DIALOG_DATA) public data: AllPetitionShowProcessDialogModel,
              private sanitizer: DomSanitizer) {
    this.workflowId = data.processInstanceId;
  }

  ngOnInit(): void {
    this.getModel();
  }

  getModel() {
    this.service.getModel(this.workflowId).subscribe(model => {
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

export class AllPetitionShowProcessDialogModel {
  constructor(public title: string,
              public processInstanceId: string) {
  }
}
