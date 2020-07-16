import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { AcceptPetitionComponent } from 'src/app/modules/accept-petition/dialog/accept-petition/accept-petition.component';
import { EditPetitionComponent } from 'src/app/modules/accept-petition/dialog/edit-petition/edit-petition.component';
import { DeletePetitionComponent } from 'src/app/modules/accept-petition/dialog/delete-petition/delete-petition.component';
import { CommentPetitionComponent } from 'src/app/modules/accept-petition/dialog/comment-petition/comment-petition.component';
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
  resultIsPublicDescription: string;
  resultDate: string;
  resultPetition: any;
  resultDatePublic: string;
  // File
  filesInfo: ImageInfo[] = [];
  filesResult: ImageInfo[] = [];
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
  petition: AllPetitionElement;
  isExpand = true;
  groupId = petitionHistoryGroupId;

  pageToGetHistory = 0;
  sizePerPageHistory = 15;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: AllPetitionService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apiProviderService: ApiProviderService
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
        console.log(data);
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
    if(this.response[0].reporter.type === 1){
      this.reporterType = "Cá nhân";
    }else if (this.response[0].reporter.type === 2){
      this.reporterType = "Tổ chức";
    }else{
      this.reporterType = "Khác";
    }
    
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
    this.takePlaceOn = this.response[0].takePlaceOn;
    this.title = this.response[0].title;
    this.processInstanceId = this.response[0].processInstanceId;
    console.log(this.processInstanceId);
    if(this.response[0].result){
      this.hasResult = true;
      this.resultContent = this.response[0].result.content;
      this.resultIsPublic = this.response[0].result.isPublic;
      if(this.resultIsPublic){
        this.resultIsPublicDescription = 'Đã công khai';
      }
      else{
        this.resultIsPublicDescription = 'Chưa công khai'
      }
      this.resultDate = this.response[0].result.date;
    }else{
      this.hasResult = false;
    }

    this.resultPetition = this.petition[0].processVariables.petitionData.result;
    if (this.resultPetition !== undefined) {
      this.resultIsPublic = this.petition[0].processVariables.petitionData.result.isPublic;
      this.resultDatePublic = this.petition[0].processVariables.petitionData.result.date;
      this.resultContent = this.petition[0].processVariables.petitionData.result.content;
    }

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
                    console.log(image.groupId.indexOf(3));
                    if(image.groupId.indexOf(3) > -1){
                      this.filesResult.push({
                        id: image.id,
                        url: urlResult,
                        name: fileName,
                        fullName: fileNamesFull
                      });
                    }
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
    //this.service.openCommentDialog(id, name);
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
    //console.log(this.router);
    //this.router.navigate(['/tat-ca-phan-anh']);
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
