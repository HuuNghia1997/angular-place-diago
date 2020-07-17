import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { AllPetitionService } from 'src/app/data/service/all-petition.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  petitionHistoryGroupId,
  petitionCommentGroupId,
} from 'src/app/data/service/config.service';
import {
  AllPetitionElement,
  PETITION_DATA,
  Comments,
  TREE_DATA,
} from 'src/app/data/schema/all-petition-element';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

function readBase64(file): Promise<any> {
  const reader = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('load', () => {
      resolve(reader.result);
    },
      false
    );

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('error', (event) => {
      reject(event);
    },
      false
    );
    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-detail-all-petition',
  templateUrl: './detail-all-petition.component.html',
  styleUrls: ['./detail-all-petition.component.scss'],
})
export class DetailAllPetitionComponent implements OnInit {
  // Khởi tạo ban đầu
  historyTypeList = [
    {
      id: 1,
      name: 'bình luận',
    },
    {
      id: 2,
      name: 'chuyển bước',
    },
    {
      id: 3,
      name: 'cập nhật thông tin',
    },
    {
      id: 4,
      name: 'thêm mới',
    },
    {
      id: 5,
      name: 'xóa',
    },
    {
      id: 6,
      name: 'tìm kiếm',
    },
  ];

  checkAccept = true;
  checkDeny = true;

  // Kết quả trả về khi lấy chi tiết phản ánh theo id
  response = [];

  // Thuộc tính phản ánh
  agencyName: string;
  createdDate: string;
  description: string;
  file: [];
  isAnonymous: boolean;
  isPublic: string;
  receptionMethod: number;
  receptionMethodDescription: string;
  reporterAddress: string;
  reporterFullname: string;
  reporterIdentityId: string;
  reporterPhone: string;
  reporterType: string;
  reporterLocationFullAddress: string;
  result: string;
  status: number;
  statusDescription: string;
  tagName: string;
  takePlaceAtFullAddress: string;
  takePlaceOn: string;
  title: string;
  processInstanceId: string;
  hasResult: boolean;
  resultContent: string;
  resultIsPublic: boolean;
  resultIsApproved: boolean;
  resultIsPublicDescription: string;
  resultIsApprovedDescription: string;
  resultDate: string;
  resultPetition: any;
  resultDatePublic: string;
  // File
  filesInfo: ImageInfo[] = [];
  fileUpload: ImageInfo[] = [];
  uploaded = true;
  reporterLocation: any;
  takePlaceAtLocation: any;
  countResultContent: number;

  // Lịch sử
  history = [];

  // Bình luận
  comments = [];

  treeControl = new NestedTreeControl<Comments>((node) => node.children);
  commentDataSource = new MatTreeNestedDataSource<Comments>();

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt'],
  });
  public hasBaseDropZoneOver = false;

  petitionId: string;
  petition: AllPetitionElement;
  isExpand = true;
  groupId = petitionHistoryGroupId;
  checkFiles = false;
  pageToGetHistory = 0;
  sizePerPageHistory = 15;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: AllPetitionService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apiProviderService: ApiProviderService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.petitionId = this.route.snapshot.params.id;
    this.getPetitionDetail();
  }

  getPetitionDetail() {
    this.service.getPetitionDetail(this.petitionId).subscribe(
      (data) => {
        this.response.push(data);
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setViewData() {
    this.agencyName = this.response[0].agency.name;
    this.createdDate = this.response[0].createdDate;
    this.description = this.response[0].description;
    this.file = this.response[0].file;
    this.isAnonymous = this.response[0].isAnonymous;
    this.isPublic = this.response[0].isPublic;
    this.receptionMethod = this.response[0].receptionMethod;
    this.receptionMethodDescription = this.receptionMethodDescription;
    this.reporterAddress = this.response[0].reporter.address.address;
    this.response[0].reporter.address.place.forEach((item) => {
      this.reporterAddress = this.reporterAddress + ', ' + item.name;
    });
    this.reporterFullname = this.response[0].reporter.fullname;
    this.reporterIdentityId = this.response[0].reporter.identityId;
    this.reporterPhone = this.response[0].reporter.phone;
    if (this.response[0].reporter.type === 1) {
      this.reporterType = 'Cá nhân';
    } else if (this.response[0].reporter.type === 2) {
      this.reporterType = 'Tổ chức';
    } else {
      this.reporterType = 'Khác';
    }

    this.reporterLocationFullAddress = this.response[0].reporterLocation.fullAddress;
    this.reporterLocation = this.response[0].reporterLocation;
    this.result = this.response[0].result;
    this.status = this.response[0].status;
    if (this.status === 1) {
      this.checkAccept = false;
    }
    if (this.status === 1 || this.status === 2) {
      this.checkDeny = false;
    }
    this.statusDescription = this.response[0].statusDescription;
    this.tagName = this.response[0].tag.name;
    this.takePlaceAtFullAddress = this.response[0].takePlaceAt.fullAddress;
    this.takePlaceAtLocation = this.response[0].takePlaceAt;
    this.takePlaceOn = this.response[0].takePlaceOn;
    this.title = this.response[0].title;
    this.processInstanceId = this.response[0].processInstanceId;
    if (this.response[0].result) {
      this.hasResult = true;
      this.resultContent = this.response[0].result.content;
      this.resultIsPublic = this.response[0].result.isPublic;
      this.countResultContent = this.resultContent.split(' ').length;
      if (this.resultIsPublic) {
        this.resultIsPublicDescription = 'Đã công khai';
      }
      else {
        this.resultIsPublicDescription = 'Chưa công khai';
      }
      this.resultIsApproved = this.response[0].result.approved;
      if (this.resultIsApproved) {
        this.resultIsApprovedDescription = 'Đã phê duyệt';
      }
      else {
        this.resultIsApprovedDescription = 'Chưa phê duyệt';
      }
      this.resultDate = this.response[0].result.date;
    } else {
      this.hasResult = false;
    }
    if (this.file.length > 0) {
      this.file.forEach(data => {
        // tslint:disable-next-line: no-string-literal
        if (data['group'][0] === 2 || data['group'][0] === 1) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          // tslint:disable-next-line: no-string-literal
          this.service.getImage(data['id']).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              // tslint:disable-next-line: no-string-literal no-shadowed-variable
              this.service.getImageName_Size(data['id']).subscribe((f: any) => {
                if (f.filename.length > 20) {
                  // Tên file quá dài
                  const startText = f.filename.substr(0, 5);
                  const shortText = f.filename.substr(f.filename.length - 6, f.filename.length);
                  fileName = startText + '...' + shortText;
                  // Tên file gốc - hiển thị tooltip
                  fileNamesFull = f.filename;
                } else {
                  fileName = f.filename;
                  fileNamesFull = f.filename;
                }
                this.fileUpload.push({
                  id: data['id'],
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

    if (this.file.length > 0) {
      this.file.forEach(data => {
        // tslint:disable-next-line: no-string-literal
        if (data['group'][0] === 3) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          // tslint:disable-next-line: no-string-literal
          this.service.getImage(data['id']).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              // tslint:disable-next-line: no-string-literal no-shadowed-variable
              this.service.getImageName_Size(data['id']).subscribe((f: any) => {
                if (f.filename.length > 20) {
                  // Tên file quá dài
                  const startText = f.filename.substr(0, 5);
                  const shortText = f.filename.substr(f.filename.length - 7, f.filename.length);
                  fileName = startText + '...' + shortText;
                  // Tên file gốc - hiển thị tooltip
                  fileNamesFull = f.filename;
                } else {
                  fileName = f.filename;
                  fileNamesFull = f.filename;
                }
                this.filesInfo.push({
                  id: data['id'],
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
    this.getPetitionHistory();
    this.getPetitionComment();
  }

  getPetitionHistory() {
    // tslint:disable-next-line:max-line-length
    this.service
      .getPetitionHistory(
        petitionHistoryGroupId,
        this.petitionId,
        this.pageToGetHistory,
        this.sizePerPageHistory
      )
      .subscribe(
        (data) => {
          data.content.forEach((item) => {
            // console.log(item);
            this.history.push(item);
          });
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getPetitionComment() {
    this.service.getPetitionComment(
      petitionCommentGroupId,
      this.petitionId,
      this.pageToGetHistory,
      this.sizePerPageHistory
    ).subscribe(data => {
      data.content.forEach((item) => {
        this.comments.push(item);
      });
    },
      (err) => {
        console.error(err);
      }
    );
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: Comments) =>
    !!node.children && node.children.length > 0

  updatePetition(id, name): void {
    this.service.updateRecord(id, name, 1);
  }

  openCancelDialog(id, name): void {
    this.service.openCancelDialog(id, name);
  }

  openAcceptDialog(id, name): void {
    this.service.openAcceptDialog(id, name);
  }

  openCommentDialog(id, name): void {
    // this.service.openCommentDialog(id, name);
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

  // remove it when have api
  getPetition(id): void {
    PETITION_DATA.forEach((element) => {
      if (element.id === id) {
        // console.log(element);
        this.petition = element;
      }
    });
  }

  getState(status: string): number {
    if (status === 'Chờ tiếp nhận') {
      return 0;
    } else {
      return 1;
    }
  }

  showProcess(id, name) {
    this.service.showProcess(id, name);
  }

  selectStyleStatus(status) {
    switch (status) {
      case 1:
        return 'btn-wait-process';
        break;
      case 2:
        return 'btn-wait-get-process';
        break;
      case 3:
        return 'btn-processed';
        break;
      case 4:
        return 'btn-cancel';
        break;
    }
  }

  getPublic(isPublic: string) {
    switch (isPublic) {
      case 'false':
        return 'Chưa công khai';
      case 'true':
        return 'Đã công khai';
    }
  }

  getApprove(isApproved: boolean) {
    switch (isApproved) {
      case false:
        return 'Chưa phê duyệt';
      case true:
        return 'Đã phê duyệt';
    }
  }

  openMapDialog(address, lat, long, type) {
    this.service.openMapDialog(address, lat, long, type);
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
