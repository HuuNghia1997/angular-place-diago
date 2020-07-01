import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { Comments, TREE_DATA } from 'src/app/data/schema/petition-element';
import { PetitionService } from 'src/app/data/service/petition.service';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { reloadTimeout } from 'src/app/data/service/config.service';
import { KeycloakService } from 'keycloak-angular';

function readBase64(file): Promise<any> {
  const reader  = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('load', function() {
      resolve(reader.result);
    }, false);

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('error', function(event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-detail-petition',
  templateUrl: './detail-petition.component.html',
  styleUrls: ['./detail-petition.component.scss']
})
export class DetailPetitionComponent implements OnInit {

  treeControl = new NestedTreeControl<Comments>(node => node.children);
  commentDataSource = new MatTreeNestedDataSource<Comments>();

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt']
  });
  public hasBaseDropZoneOver = false;

  petitionId: string;
  isExpand = true;
  status: string;

  petition = [];
  petitionStatus: string;
  petitionTitle: string;
  petitionTag: any;
  petitionTakePlaceOn: string;
  petitionCreatedDate: string;
  petitionAgency: any;
  petitionCreatePlace: string;
  petitionTakePlaceAt: string;
  petitionContent: string;
  reporterName: string;
  reporterPhone: string;
  reporteridentityId: string;
  reporterType: number;
  reporterAddress: string;
  reporterPlace: any;
  taskName: string;
  processPublic: boolean;
  resultPetition: any;
  resultIsPublic: boolean;
  resultDatePublic: string;
  resultContent: string;

  filesInfo: ImageInfo[] = [];

  groupId = 2;
  pageToGetHistory = 0;
  sizePerPageHistory = 15;
  history = [];

  constructor(private actRoute: ActivatedRoute,
              private dialog: MatDialog,
              private service: PetitionService,
              private keycloak: KeycloakService) {
    this.petitionId = this.actRoute.snapshot.params.id;
    this.commentDataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    // console.log(this.petitionId);
    this.getDetail();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileSelected(event: any) {
    const file: File = event[0];
    // console.log(file);
    // tslint:disable-next-line:only-arrow-functions
    readBase64(file).then(function(data) {
      // console.log(data);
    });
  }

  getDetail() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      console.log(data.list.entries);
      this.petition.push(data.list.entries[0].entry);
      this.setViewData();
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  setViewData() {
    this.petitionStatus = this.petition[0].status;
    this.petitionTitle = this.petition[0].processVariables.title;
    this.petitionTag = this.petition[0].processVariables.petitionData.tag.name;
    this.petitionTakePlaceOn = this.petition[0].processVariables.petitionData.takePlaceOn;
    this.petitionCreatedDate = this.petition[0].processVariables.petitionData.createdDate;
    this.petitionAgency = this.petition[0].processVariables.petitionData.agency.name;
    this.petitionCreatePlace = this.petition[0].processVariables.petitionData.reporterLocation.fullAddress;
    this.petitionTakePlaceAt = this.petition[0].processVariables.petitionData.takePlaceAt.fullAddress;
    this.petitionContent = this.petition[0].processVariables.petitionData.description;
    this.reporterName = this.petition[0].processVariables.petitionData.reporter.fullname;
    this.reporterPhone = this.petition[0].processVariables.petitionData.reporter.phone;
    this.reporteridentityId = this.petition[0].processVariables.petitionData.reporter.identityId;
    this.reporterType = this.petition[0].processVariables.petitionData.reporter.type;
    this.reporterAddress = this.petition[0].processVariables.petitionData.reporter.address.address + ',';
    this.reporterPlace = this.petition[0].processVariables.petitionData.reporter.address.place;
    this.processPublic = this.petition[0].processVariables.petitionData.isPublic;
    this.taskName = this.petition[0].name;

    this.resultPetition = this.petition[0].processVariables.petitionData.result;
    if (this.resultPetition !== undefined) {
      this.resultIsPublic = this.petition[0].processVariables.petitionData.result.isPublic;
      this.resultDatePublic = this.petition[0].processVariables.petitionData.result.date;
      this.resultContent = this.petition[0].processVariables.petitionData.result.content;
      // resultIsPublic: boolean;
      // resultDatePublic: string;
      // resultContent: string;
    }
  }

  getHistory() {
    this.service.getHistory(this.groupId, this.petitionId, this.pageToGetHistory, this.sizePerPageHistory).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.history.push(data.content[i]);
      }
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  claimTask() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      this.service.claimTask(taskId).subscribe(res => {
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  releaseTask() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      this.service.releaseTask(taskId).subscribe(res => {
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: Comments) => !!node.children && node.children.length > 0;

  updatePetition(id, name) {
    this.service.updatePetition(id, name);
  }

  updateResult(id, name) {
    this.service.updateResult(id, name);
  }

  showProcess(id, name) {
    this.service.showProcess(id, name);
  }

  completePetition(id, name) {
    this.service.completePetition(id, name);
  }

  getStatus(status: string) {
    switch (status) {
      case 'ASSIGNED':
        return 'Chờ xử lý';
      case 'CREATED':
        return 'Chờ nhận xử lý';
    }
  }

  getReportType(type: number) {
    switch (type) {
      case 1:
        return 'Cá nhân';
      case 2:
        return 'Tổ chức';
      case 3:
        return 'Khác';
    }
  }

  getStatusInfoProcess(status: number) {
    switch (status) {
      case 1:
        return 'Chờ tiếp nhận';
      case 1:
        return 'Đang xử lý';
      case 1:
        return 'Hoàn thành';
      case 1:
        return 'Từ chối xử lý';
    }
  }

  getPublic(isPublic: boolean) {
    switch (isPublic) {
      case false:
        return 'Chưa công khai';
      case true:
        return 'Đã công khai';
    }
  }

}
