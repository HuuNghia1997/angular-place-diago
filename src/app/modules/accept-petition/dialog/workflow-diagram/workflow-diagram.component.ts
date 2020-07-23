import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-workflow-diagram',
  templateUrl: './workflow-diagram.component.html',
  styleUrls: ['./workflow-diagram.component.scss'],
})
export class WorkflowDiagramComponent implements OnInit {
  // Khởi tạo
  private processDefinitionId: string;
  public svgIcon: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmWorkflowDiagramDialogModel,
    private service: AcceptPetitionService,
    private sanitizer: DomSanitizer
  ) {
    this.processDefinitionId = data.id;
  }

  ngOnInit(): void {
    this.getProcessDefinitions();
  }

  getProcessDefinitions() {
    this.service.getProcessDefinitions(this.processDefinitionId).subscribe(
      (data) => {
        // console.log(data);
        const blob = new Blob([data], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.svgIcon = this.sanitizer.bypassSecurityTrustUrl(url);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}

export class ConfirmWorkflowDiagramDialogModel {
  constructor(
    public title: string,
    public message: string,
    public id: string
  ) {}
}
