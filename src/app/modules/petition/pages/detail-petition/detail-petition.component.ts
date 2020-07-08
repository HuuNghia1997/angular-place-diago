import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { reloadTimeout } from 'src/app/data/service/config.service';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-detail-petition',
  templateUrl: './detail-petition.component.html',
  styleUrls: ['./detail-petition.component.scss']
})
export class DetailPetitionComponent implements OnInit {

  treeControl = new NestedTreeControl<any>(node => node.children);
  commentDataSource = new MatTreeNestedDataSource<any>();

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
  fileUpload: ImageInfo[] = [];

  groupId = 2;
  pageToGetHistory = 0;
  sizePerPageHistory = 15;
  history = [];

  uploadedImage: UpdateFile[] = [];
  uploaded: boolean;
  upload = true;
  countDefaultImage;
  TREE_DATA = [];
  blankVal: any;
  files = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;
  itemsListUsers = [];
  response = [];
  keyword: '';
  updateForm = new FormGroup({
    variables: new FormGroup({
      title: new FormControl(''),
      petitionData: new FormGroup({
        id: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        takePlaceAt: new FormControl(''),
        reporterLocation: new FormControl(''),
        takePlaceOn: new FormControl(''),
        status: new FormControl(''),
        confirm: new FormControl(''),
        workflow: new FormControl(''),
        tag: new FormControl(''),
        file: new FormControl(''),
        reporter: new FormControl(''),
        thumbnailId: new FormControl(''),
        createdDate: new FormControl(''),
        isPublic: new FormControl(''),
        isAnonymous: new FormControl(''),
        result: new FormControl(''),
        processInstanceId: new FormControl(''),
        deploymentId: new FormControl(''),
        agency: new FormControl(''),
        receptionMethod: new FormControl('')
      }),
    }),
    payloadType: new FormControl('')
  });
  token: any;
  type: number[] = [];
  accountId: string;

  constructor(private actRoute: ActivatedRoute,
              private dialog: MatDialog,
              private service: PetitionService,
              private keycloak: KeycloakService) {
    this.petitionId = this.actRoute.snapshot.params.id;
    this.commentDataSource.data = this.TREE_DATA;
  }

  ngOnInit(): void {
    this.getDetail();
    this.getComment();
  }

  getComment() {
    const groupId = 1;
    this.service.getComment(groupId, this.petitionId).subscribe(cmt => {
      this.TREE_DATA = cmt.content;
    });
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: any) => !!node.content && node.content.length > 0;

  uploadFile() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.token = this.keycloak.getKeycloakInstance().token;

      this.keycloak.loadUserProfile().then(user => {
        // tslint:disable-next-line: no-string-literal
        this.accountId = user['attributes'].user_id;
        this.countDefaultImage = this.uploadedImage.length;
        if (this.countDefaultImage > 0) {
          if (this.files.length > 0) {
            this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
              file.forEach(e => {
                this.type.push(2);
                this.uploadedImage.push({
                  id: e.id,
                  name: e.filename,
                  group: this.type
                });
                this.type = [];
              });
              this.formToJson();
            });
          } else {
            this.formToJson();
          }
        } else {
          if (this.files.length > 0) {
            this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
              file.forEach(e => {
                this.type.push(2);
                this.uploadedImage.push({
                  id: e.id,
                  name: e.filename,
                  group: this.type
                });
                this.type = [];
              });
              this.formToJson();
            });
          } else {
            this.formToJson();
          }
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  onFileSelected(event: any) {
    let i = 0;
    if (event.target.files && event.target.files[0]) {
      for (const file of event.target.files) {
        // =============================================
        let urlResult: any;
        let fileName = '';
        let fileNamesFull = '';

        // =============================================
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (eventLoad) => {
          this.upload = true;
          urlResult = eventLoad.target.result;
          if (file.name.length > 20) {
            // Tên file quá dài
            const startText = event.target.files[i].name.substr(0, 5);
            // tslint:disable-next-line:max-line-length
            const shortText = event.target.files[i].name.substring(event.target.files[i].name.length - 7, event.target.files[i].name.length);
            fileName = startText + '...' + shortText;
            // Tên file gốc - hiển thị tooltip
            fileNamesFull = event.target.files[i].name;
          } else {
            fileName = file.name;
            fileNamesFull = file.name ;
          }
          this.fileUpload.push( {
            id: i,
            url: urlResult,
            name: fileName,
            fullName: fileNamesFull
          });
        };
        reader.readAsDataURL(event.target.files[i]);
        i++;
      }
    }
    this.uploadFile();
  }

  removeItem(id: string) {
    let counter = 0;
    let index = 0;
    this.fileUpload.forEach(file => {
      if (file.id === id) {
        index = counter;
      }
      counter++;
    });
    this.uploadedImage = this.uploadedImage.filter(item => item.id !== id);
    this.filesInfo.splice(index, 1);
    this.files.splice(index, 1);

    this.blankVal = '';
    console.log('List file còn lại: ');
    console.log(this.files);
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

  updateImage(requestBody) {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.service.postVariable(data.list.entries[0].entry.processInstanceId, requestBody).subscribe(res => {
        // this.dialogRef.close(true);
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }, err => {
        // this.dialogRef.close(false);
        console.error(err);
      });
    });
  }

  formToJson() {
    const formObj = this.updateForm.getRawValue();
    formObj.variables.title = this.petition[0].processVariables.title;
    formObj.variables.petitionData.id = this.petition[0].processVariables.petitionData.id;
    formObj.variables.petitionData.title = this.petition[0].processVariables.title;
    formObj.variables.petitionData.description = this.petition[0].processVariables.petitionData.description;
    formObj.variables.petitionData.takePlaceAt = this.petition[0].processVariables.petitionData.takePlaceAt;
    formObj.variables.petitionData.reporterLocation = this.petition[0].processVariables.petitionData.reporterLocation;
    formObj.variables.petitionData.takePlaceOn = this.petition[0].processVariables.petitionData.takePlaceOn;
    formObj.variables.petitionData.status = this.petition[0].processVariables.status;
    formObj.variables.petitionData.confirm = this.petition[0].processVariables.confirm;
    formObj.variables.petitionData.workflow = this.petition[0].processVariables.petitionData.workflow;
    formObj.variables.petitionData.tag = this.petition[0].processVariables.petitionData.tag;
    formObj.variables.petitionData.reporter  = this.petition[0].processVariables.petitionData.reporter;
    formObj.variables.petitionData.thumbnailId = this.petition[0].processVariables.petitionData.thumbnailId;
    formObj.variables.petitionData.createdDate = this.petition[0].processVariables.petitionData.createdDate;
    formObj.variables.petitionData.isPublic = this.petition[0].processVariables.petitionData.isPublic;
    formObj.variables.petitionData.isAnonymous = this.petition[0].processVariables.petitionData.isAnonymous;
    formObj.variables.petitionData.processInstanceId = this.petition[0].processVariables.petitionData.processInstanceId;
    formObj.variables.petitionData.deploymentId = this.petition[0].processVariables.petitionData.deploymentId;
    formObj.variables.petitionData.agency = this.petition[0].processVariables.petitionData.agency;
    formObj.variables.petitionData.receptionMethod = this.petition[0].processVariables.petitionData.receptionMethod;
    formObj.variables.petitionData.result = this.petition[0].processVariables.petitionData.result;

    formObj.variables.petitionData.file = this.uploadedImage;

    formObj.payloadType = 'SetProcessVariablesPayload';

    const resultJSON = JSON.stringify(formObj, null, 2);
    console.log(resultJSON);
    this.updateImage(resultJSON);
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
    }

    this.uploadedImage = this.petition[0].processVariables.petitionData.file;

    if (this.petition[0].processVariables.petitionData.file.length > 0) {
      this.petition[0].processVariables.petitionData.file.forEach(e => {
        if (e.group[0] === 2 || e.group[0] === 1) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getFile(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getFileName_Size(e.id).subscribe((data: any ) => {
                if (data.filename.length > 20) {
                  // Tên file quá dài
                  const startText = data.filename.substr(0, 5);
                  const shortText = data.filename.substr(data.filename.length - 7, data.filename.length);
                  fileName = startText + '...' + shortText;
                  // Tên file gốc - hiển thị tooltip
                  fileNamesFull = data.filename;
                } else {
                  fileName = data.filename;
                  fileNamesFull = data.filename;
                }
                this.fileUpload.push({
                  id: e,
                  url: urlResult,
                  name: fileName,
                  fullName: fileNamesFull
                });
              }, err => {
                console.error(err);
              });
            }, false);
            reader.readAsDataURL(file);
          }, err => {
            console.error(err);
          });
        }

      });
    }

    if (this.petition[0].processVariables.petitionData.file.length > 0) {
      this.petition[0].processVariables.petitionData.file.forEach(e => {
        if (e.group[0] === 3) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getFile(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getFileName_Size(e.id).subscribe((data: any ) => {
                if (data.filename.length > 20) {
                  // Tên file quá dài
                  const startText = data.filename.substr(0, 5);
                  const shortText = data.filename.substr(data.filename.length - 7, data.filename.length);
                  fileName = startText + '...' + shortText;
                  // Tên file gốc - hiển thị tooltip
                  fileNamesFull = data.filename;
                } else {
                  fileName = data.filename;
                  fileNamesFull = data.filename;
                }
                this.filesInfo.push({
                  id: e,
                  url: urlResult,
                  name: fileName,
                  fullName: fileNamesFull
                });
              }, err => {
                console.error(err);
              });
            }, false);
            reader.readAsDataURL(file);
          }, err => {
            console.error(err);
          });
        }

      });
    }
    this.uploaded = true;
    this.upload = true;
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

  comment(id) {
    this.service.comment(id);
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
