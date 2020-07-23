import { Component, OnInit, Inject } from '@angular/core';
import { ApplyProcessComponent } from '../apply-process/apply-process.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-process',
  templateUrl: './show-process.component.html',
  styleUrls: ['./show-process.component.scss']
})
export class ShowProcessComponent implements OnInit {

  workflowId: string;
  status: number;
  workflowName: any;
  svgIcon: any;

  constructor(public dialogRef: MatDialogRef<ShowProcessComponent>,
              private service: ConfigPetitionService,
              @Inject(MAT_DIALOG_DATA) public data: ShowProcessDialogModel,
              private sanitizer: DomSanitizer) {
    this.workflowId = data.id;
  }

  ngOnInit(): void {
    this.getModel();
  }

  getModel() {
    this.service.getWorkflowDetail(this.workflowId).subscribe(data => {
      this.workflowName = data.name;
      this.service.getModelDeploy(data.processDefinitionId).subscribe(model => {
        const blob = new Blob([model], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.svgIcon = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    });
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  applyProcess(id, name): void {
    this.service.applyProcess(id, name);
  }
}

export class ShowProcessDialogModel {
  constructor(public title: string,
              public id: string) {
  }
}
