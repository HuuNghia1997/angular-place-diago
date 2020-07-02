import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  petitionHistoryGroupId,
  petitionCommentGroupId,
} from 'src/app/data/service/config.service';
import {
  AcceptPetitionElement,
  Comments,
} from 'src/app/data/schema/accept-petition-element';

function readBase64(file): Promise<any> {
  const reader = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'load',
      function () {
        resolve(reader.result);
      },
      false
    );

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'error',
      function (event) {
        reject(event);
      },
      false
    );

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-detail-accept-petition',
  templateUrl: './detail-accept-petition.component.html',
  styleUrls: ['./detail-accept-petition.component.scss'],
})
export class DetailAcceptPetitionComponent implements OnInit {
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
  checkAccept: boolean = true;
  checkDeny: boolean = true;

  // Kết quả trả về khi lấy chi tiết phản ánh theo id
  response = [];

  // Thuộc tính phản ánh
  agencyName: string;
  createdDate: string;
  description: string;
  file: [];
  isAnonymous: boolean;
  isPublic: boolean;
  receptionMethod: number;
  receptionMethodDescription: string;
  reporterAddress: string;
  reporterFullname: string;
  reporterIdentityId: string;
  reporterPhone: string;
  reporterLocationFullAddress: string;
  result: string;
  status: number;
  statusDescription: string;
  tagName: string;
  takePlaceAt: any;
  takePlaceAtFullAddress: string;
  takePlaceOn: string;
  title: string;

  // File
  filesInfo: ImageInfo[] = [];
  uploaded = true;

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
  petition: AcceptPetitionElement;
  isExpand = true;
  groupId = petitionHistoryGroupId;

  pageToGetHistory = 0;
  sizePerPageHistory = 15;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: AcceptPetitionService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.petitionId = this.route.snapshot.params.id;
    this.getPetitionDetail();
    this.getPetitionHistory();
    this.getPetitionComment();
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
    console.log(this.response[0]);
    if (this.response[0].agency != undefined) {
      this.agencyName = this.response[0].agency.name;
    }

    this.createdDate = this.response[0].createdDate;
    this.description = this.response[0].description;
    this.file = this.response[0].file;
    this.isAnonymous = this.response[0].isAnonymous;
    this.isPublic = this.response[0].isPublic;
    this.receptionMethod = this.response[0].receptionMethod;
    this.receptionMethodDescription = this.receptionMethodDescription;

    if (this.response[0].reporter.address != undefined) {
      this.reporterAddress = this.response[0].reporter.address.address;
    }

    if (this.response[0].reporter.address != undefined) {
      this.response[0].reporter.address.place.forEach((item) => {
        this.reporterAddress = this.reporterAddress + ', ' + item.name;
      });
    }

    this.reporterFullname = this.response[0].reporter.fullname;
    this.reporterIdentityId = this.response[0].reporter.identityId;
    this.reporterPhone = this.response[0].reporter.phone;
    this.reporterLocationFullAddress = this.response[0].reporterLocation.fullAddress;
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
    this.takePlaceAt = this.response[0].takePlaceAt;
    this.takePlaceOn = this.response[0].takePlaceOn;
    this.title = this.response[0].title;

    if (this.response[0].file.length > 0) {
      this.response[0].file.forEach((image) => {
        let urlResult: any;
        let fileName = '';
        let fileNamesFull = '';

        this.service.getImage(image.id).subscribe(
          (data) => {
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                urlResult = reader.result;
                this.service.getImageName_Size(image.id).subscribe(
                  (data: any) => {
                    if (data.filename.length > 20) {
                      // Tên file quá dài
                      const startText = data.filename.substr(0, 5);
                      const shortText = data.filename.substr(
                        data.filename.length - 7,
                        data.filename.length
                      );
                      fileName = startText + '...' + shortText;
                      // Tên file gốc - hiển thị tooltip
                      fileNamesFull = data.filename;
                    } else {
                      fileName = data.filename;
                      fileNamesFull = data.filename;
                    }
                    this.filesInfo.push({
                      id: image.id,
                      url: urlResult,
                      name: fileName,
                      fullName: fileNamesFull,
                    });
                  },
                  (err) => {
                    console.error(err);
                  }
                );
              },
              false
            );
            reader.readAsDataURL(data);
            this.checkFiles = true;
          },
          (err) => {
            console.error(err);
          }
        );
      });
    }
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
    // tslint:disable-next-line:max-line-length
    this.service
      .getPetitionComment(
        petitionCommentGroupId,
        this.petitionId,
        this.pageToGetHistory,
        this.sizePerPageHistory
      )
      .subscribe(
        (data) => {
          data.content.forEach((item) => {
            let temp = {
              name: item.user.fullname,
              time: item.createdDate,
              children: [
                {
                  name: item.content,
                  time: '',
                },
              ],
            };
            this.comments.push(temp);
          });

          this.commentDataSource.data = this.comments;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  buildTree(item) {}

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: Comments) =>
    !!node.children && node.children.length > 0;

  updatePetition(id, name): void {
    this.service.updateRecord(id, name);
  }

  openCancelDialog(id, name): void {
    this.service.openCancelDialog(id, name);
  }

  openAcceptDialog(id, name): void {
    this.service.openAcceptDialog(id, name);
  }

  openCommentDialog(id, name): void {
    this.service.openCommentDialog(id, name);
  }

  openMapDialog(address, long, lat) {
    this.service.openMapDialog(address, { longitude: long, latitude: lat });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileSelected(event: any) {
    const file: File = event[0];
    // console.log(file);
    // tslint:disable-next-line:only-arrow-functions
    readBase64(file).then(function (data) {
      // console.log(data);
    });
  }

  getState(status: string): number {
    if (status === 'Chờ tiếp nhận') {
      return 0;
    } else {
      return 1;
    }
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

  checkFiles: boolean = false;
}
