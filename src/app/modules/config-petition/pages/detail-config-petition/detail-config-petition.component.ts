import { Component, OnInit } from '@angular/core';
import { ConfigPetitionElement } from 'src/app/data/schema/config-petition-element';
import { ActivatedRoute } from '@angular/router';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-config-petition',
  templateUrl: './detail-config-petition.component.html',
  styleUrls: ['./detail-config-petition.component.scss']
})
export class DetailConfigPetitionComponent implements OnInit {

  configPetitionId: string;
  configPetition: ConfigPetitionElement;
  groupId = 8;
  pageToGetHistory = 0;
  sizePerPageHistory = 15;

  workflowName: string;
  workflowStatus: number;
  workflowTags: any;
  workflowCreatedDate: string;
  workflowId: string;

  response = [];

  // image
  files = [];

  // Lịch sử
  history = [];

  result: boolean;
  blankVal: any;
  svgIcon: any;

  constructor(private actRoute: ActivatedRoute,
              private service: ConfigPetitionService,
              private sanitizer: DomSanitizer) {
    this.configPetitionId = this.actRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getWorkflowDetail();
    this.getWorkflowHistory();
    this.getModel();
  }

  getModel() {
    this.service.getWorkflowDetail(this.configPetitionId).subscribe(data => {
      this.service.getModelDeploy(data.processDefinitionId).subscribe(model => {
        const blob = new Blob([model], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.svgIcon = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    });
  }

  getWorkflowHistory() {
    // tslint:disable-next-line:max-line-length
    this.service.getWorkflowHistory(this.groupId, this.configPetitionId, this.pageToGetHistory, this.sizePerPageHistory).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.history.push(data.content[i]);
      }
    }, err => {
      console.error(err);
    });
  }

  getStatus(status: number) {
    switch (status) {
      case 0:
        return 'Chưa áp dụng';
      case 1:
        return 'Đã áp dụng';
      case 2:
        return 'Đã hủy áp dụng';
    }
  }

  setViewData() {
    this.workflowName = this.response[0].name;
    this.workflowStatus = this.response[0].status;
    this.workflowTags = this.response[0].tag;
    this.workflowId = this.response[0].processDefinitionId;
    this.workflowCreatedDate = this.response[0].createdDate;
  }

  getWorkflowDetail() {
    this.service.getWorkflowDetail(this.configPetitionId).subscribe(data => {
      this.response.push(data);
      this.setViewData();
    }, err => {
      console.error(err);
    });
  }

  addProcess() {
    this.service.addProcess();
  }

  updateProcess(id, name): void {
    this.service.updateProcess(id, name);
  }

  deleteProcess(id, name): void {
    this.service.deleteProcess(id, name);
  }

  unApplyProcess(id, name): void {
    this.service.unApplyProcess(id, name);
  }

  applyProcess(id, name): void {
    this.service.applyProcess(id, name);
  }
}
