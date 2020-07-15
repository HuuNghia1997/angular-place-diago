import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { reloadTimeout, petitionAcceptFileExtension, petitionAcceptFileType } from 'src/app/data/service/config.service';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-petition',
  templateUrl: './detail-petition.component.html',
  styleUrls: ['./detail-petition.component.scss']
})
export class DetailPetitionComponent implements OnInit {

  treeControl = new NestedTreeControl<any>(node => node.children);
  commentDataSource = new MatTreeNestedDataSource<any>();

  petitionId: string;
  processInstanceId: string;
  taskId: string;
  isExpand = true;
  status: string;
  acceptFileExtension = petitionAcceptFileExtension;
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
  countResultContent: number;

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
  allFiles = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;
  itemsListUsers = [];
  response = [];
  keyword: '';

  updateFormTask = new FormGroup({
    value: new FormGroup({
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
  payloadType: new FormControl(''),
  taskId: new FormControl('')
});

  type: number[] = [];
  accountId: string;

  constructor(private actRoute: ActivatedRoute,
              private dialog: MatDialog,
              private service: PetitionService,
              private keycloak: KeycloakService,
              private snackbar: SnackbarService,
              private sanitizer: DomSanitizer) {
    this.taskId = this.actRoute.snapshot.params.id;
    this.commentDataSource.data = this.TREE_DATA;
  }

  ngOnInit(): void {
    this.getDetail();
  }

  getComment() {
    const groupId = 1;
    this.service.getComment(groupId, this.petitionId).subscribe(cmt => {
      const size = cmt.numberOfElements;
      for (let i = size - 1; i >= 0; i--) {
        this.TREE_DATA.push(cmt.content[i]);
      }
    });
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: any) => !!node.content && node.content.length > 0;

  uploadFile() {
    (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'block';
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
            this.formToJson(1, '');
          });
        } else {
          this.formToJson(1, '');
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
            this.formToJson(1, '');
          });
        } else {
          this.formToJson(1, '');
        }
      }
    });
  }

  onFileSelected(event: any) {
    let i = 0;
    if (event.target.files && event.target.files[0]) {
      for (const file of event.target.files) {
        if (petitionAcceptFileType.indexOf(file.type) > 0) {
          console.log(file.type);
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
              const startText = file.name.substr(0, 5);
              // tslint:disable-next-line:max-line-length
              const shortText = file.name.substring(file.name.length - 6, file.name.length);
              fileName = startText + '...' + shortText;
              // Tên file gốc - hiển thị tooltip
              fileNamesFull = file.name;
            } else {
              fileName = file.name;
              fileNamesFull = file.name;
            }
            this.fileUpload.push({
              id: i,
              url: urlResult,
              name: fileName,
              fullName: fileNamesFull
            });
          };
          reader.readAsDataURL(event.target.files[i]);
          i++;
        } else {
          this.snackbar.openSnackBar('Không hỗ trợ loại tệp tin này', '', '', '', 'error_notification');
        }
      }
    }
    if (i === this.files.length) {
      this.uploadFile();
    }
  }

  removeItem(id: string) {
    (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'block';
    this.blankVal = '';
    const updatedMainArray: ImageInfo[] = [];
    for (const el of this.fileUpload) {
      if (el.id.id !== id) {
        updatedMainArray.push(el);
      }
    }
    this.fileUpload = updatedMainArray;

    const updatedArray = [];
    for (const el of this.uploadedImage) {
      if (el.id !== id) {
        updatedArray.push(el);
      }
    }
    this.uploadedImage = updatedArray;
    this.formToJson(2, id);
  }

  getDetail() {
    this.service.getDetailPetition(this.taskId).subscribe(data => {
      this.petition.push(data.entry);
      console.log(data.entry);
      this.setViewData();
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  uploadImage(requestBody) {
    this.service.postVariable(this.taskId, requestBody).subscribe(res => {
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(() => {
        (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
      }, 500);
      this.snackbar.openSnackBar('Tải lên', '', 'thành công', '', 'success_notification');
    }, err => {
      setTimeout(() => {
        (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
      }, 500);
      this.snackbar.openSnackBar('Tải lên', '', 'thất bại', '', 'error_notification');
      setTimeout(() => {
        window.location.reload();
      }, reloadTimeout);
      console.error(err);
    });
  }

  removeImage(requestBody, fileId: string) {
    this.service.postVariable(this.taskId, requestBody).subscribe(res => {
      this.service.deleteFile(fileId).subscribe(data => {
        setTimeout(() => {
          (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
        }, 500);
        this.snackbar.openSnackBar('Xoá tệp tin', '', 'thành công', '', 'success_notification');
      }, err => {
        setTimeout(() => {
          (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
        }, 500);
        this.snackbar.openSnackBar('Xoá tệp tin', '', 'thất bại', '', 'error_notification');
        setTimeout(() => {
          // window.location.reload();
        }, reloadTimeout);
        console.error(err);
      });
    }, err => {
      setTimeout(() => {
        (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
      }, 500);
      setTimeout(() => {
        window.location.reload();
      }, reloadTimeout);
      console.error(err);
    });
  }

  formToJson(type, fileId: string) {
    const formObj = this.updateFormTask.getRawValue();
    formObj.value.id = this.petition[0].taskLocalVariables.petitionData.id;
    formObj.value.title = this.petition[0].taskLocalVariables.title;
    formObj.value.description = this.petition[0].taskLocalVariables.petitionData.description;
    formObj.value.takePlaceAt = this.petition[0].taskLocalVariables.petitionData.takePlaceAt;
    formObj.value.reporterLocation = this.petition[0].taskLocalVariables.petitionData.reporterLocation;
    formObj.value.takePlaceOn = this.petition[0].taskLocalVariables.petitionData.takePlaceOn;
    formObj.value.status = this.petition[0].taskLocalVariables.status;
    formObj.value.confirm = this.petition[0].taskLocalVariables.confirm;
    formObj.value.workflow = this.petition[0].taskLocalVariables.petitionData.workflow;
    formObj.value.tag = this.petition[0].taskLocalVariables.petitionData.tag;
    formObj.value.reporter  = this.petition[0].taskLocalVariables.petitionData.reporter;
    formObj.value.thumbnailId = this.petition[0].taskLocalVariables.petitionData.thumbnailId;
    formObj.value.createdDate = this.petition[0].taskLocalVariables.petitionData.createdDate;
    formObj.value.isPublic = this.petition[0].taskLocalVariables.petitionData.isPublic;
    formObj.value.isAnonymous = this.petition[0].taskLocalVariables.petitionData.isAnonymous;
    formObj.value.processInstanceId = this.petition[0].taskLocalVariables.petitionData.processInstanceId;
    formObj.value.deploymentId = this.petition[0].taskLocalVariables.petitionData.deploymentId;
    formObj.value.agency = this.petition[0].taskLocalVariables.petitionData.agency;
    formObj.value.receptionMethod = this.petition[0].taskLocalVariables.petitionData.receptionMethod;
    formObj.value.result = this.petition[0].taskLocalVariables.petitionData.result;

    formObj.value.file = this.uploadedImage;
    formObj.taskId = this.taskId;
    formObj.payloadType = 'UpdateTaskVariablePayload';
    const resultJSON = JSON.stringify(formObj, null, 2);

    switch (type) {
      case 1: // upload image
        this.uploadImage(resultJSON);
        break;
      case 2: // delete image
        this.removeImage(resultJSON, fileId);
        break;
    }
  }

  setViewData() {
    this.petitionStatus = this.petition[0].status;
    this.petitionTitle = this.petition[0].taskLocalVariables.petitionData.title;
    this.petitionTag = this.petition[0].taskLocalVariables.petitionData.tag.name;
    this.petitionTakePlaceOn = this.petition[0].taskLocalVariables.petitionData.takePlaceOn;
    this.petitionCreatedDate = this.petition[0].taskLocalVariables.petitionData.createdDate;
    this.petitionAgency = this.petition[0].taskLocalVariables.petitionData.agency.name;
    this.petitionCreatePlace = this.petition[0].taskLocalVariables.petitionData.reporterLocation.fullAddress;
    this.petitionTakePlaceAt = this.petition[0].taskLocalVariables.petitionData.takePlaceAt.fullAddress;
    this.petitionContent = this.petition[0].taskLocalVariables.petitionData.description;
    this.reporterName = this.petition[0].taskLocalVariables.petitionData.reporter.fullname;
    this.reporterPhone = this.petition[0].taskLocalVariables.petitionData.reporter.phone;
    this.reporteridentityId = this.petition[0].taskLocalVariables.petitionData.reporter.identityId;
    this.reporterType = this.petition[0].taskLocalVariables.petitionData.reporter.type;
    this.reporterAddress = this.petition[0].taskLocalVariables.petitionData.reporter.address.address + ',';
    this.reporterPlace = this.petition[0].taskLocalVariables.petitionData.reporter.address.place;
    this.processPublic = this.petition[0].taskLocalVariables.petitionData.isPublic;
    this.taskName = this.petition[0].name;
    this.taskId = this.petition[0].id;
    this.processInstanceId = this.petition[0].processInstanceId;
    this.petitionId = this.petition[0].taskLocalVariables.petitionData.id;
    this.resultPetition = this.petition[0].taskLocalVariables.petitionData.result;
    if (this.resultPetition !== undefined) {
      this.resultIsPublic = this.petition[0].taskLocalVariables.petitionData.result.isPublic;
      this.resultDatePublic = this.petition[0].taskLocalVariables.petitionData.result.date;
      this.resultContent = this.petition[0].taskLocalVariables.petitionData.result.content;
      this.countResultContent = this.resultContent.split(' ').length;
    }

    this.uploadedImage = this.petition[0].taskLocalVariables.petitionData.file;

    if (this.petition[0].taskLocalVariables.petitionData.file.length > 0) {
      this.petition[0].taskLocalVariables.petitionData.file.forEach(e => {
        if (e.group[0] === 2 || e.group[0] === 1) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getFile(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getFileName_Size(e.id).subscribe((data: any) => {
                if (data.filename.length > 20) {
                  // Tên file quá dài
                  const startText = data.filename.substr(0, 5);
                  const shortText = data.filename.substr(data.filename.length - 6, data.filename.length);
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

    if (this.petition[0].taskLocalVariables.petitionData.file.length > 0) {
      this.petition[0].taskLocalVariables.petitionData.file.forEach(e => {
        if (e.group[0] === 3) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getFile(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getFileName_Size(e.id).subscribe((data: any) => {
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
    this.getComment();
    this.getHistory();
  }

  getHistory() {
    this.service.getHistory(this.groupId, this.petitionId, this.pageToGetHistory, this.sizePerPageHistory).subscribe(data => {
      // console.log(data);
      const size = data.numberOfElements;
      for (let i = size - 1; i >= 0; i--) {
        this.history.push(data.content[i]);
      }
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  claimTask(name) {
    const message = 'Nhận xử lý';
    const content = name;
    const reason = '';
    this.service.claimTask(this.taskId).subscribe(res => {
      this.snackbar.openSnackBar(message, content, 'thành công', reason, 'success_notification');
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(function() {
        window.location.reload();
      }, reloadTimeout);
    }, err => {
      this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  releaseTask(name) {
    const message = 'Bỏ nhận xử lý';
    const content = name;
    const reason = '';
    this.service.releaseTask(this.taskId).subscribe(res => {
      this.snackbar.openSnackBar(message, content, 'thành công', reason, 'success_notification');
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(function() {
        window.location.reload();
      }, reloadTimeout);
    }, err => {
      if (err.status === 401) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
        this.keycloak.login();
      }
    });
  }

  updatePetition(taskId, name) {
    this.service.updatePetition(taskId, name);
  }

  updateResult(taskId, name) {
    this.service.updateResult(taskId, name);
  }

  showProcess(processInstanceId, name) {
    this.service.showProcess(processInstanceId, name);
  }

  completePetition(taskId, name) {
    this.service.completePetition(taskId, name);
  }

  comment(petitionId) {
    this.service.comment(petitionId);
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

  openLightbox(fileURL, fileId, fileName, type) {
    switch (type) {
      case 1:
        this.service.openLightbox(fileURL, fileId, this.fileUpload, fileName);
        break;
      case 2:
        this.service.openLightbox(fileURL, fileId, this.filesInfo, fileName);
        break;
    }
  }

  bypassSecurityTrustUrl(base64URL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64URL);
  }
}
