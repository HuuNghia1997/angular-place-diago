import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  petitionHistoryGroupId,
  petitionCommentGroupId,
} from 'src/app/data/service/config.service';
import {
  AcceptPetitionElement,
  PETITION_DATA,
  Comments,
  TREE_DATA,
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
  takePlaceAtFullAddress: string;
  takePlaceOn: string;
  title: string;

  // File
  filesInfo: ImageInfo[] = [];
  uploaded = true;

  // Lịch sử
  history = [];

  // Bình luận
  comment = [];

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
    public snackBar: MatSnackBar,
    private apiProviderService: ApiProviderService
  ) {}

  ngOnInit(): void {
    this.petitionId = this.route.snapshot.params.id;
    this.getPetitionDetail();
    this.getPetitionHistory();
  }

  getPetitionDetail() {
    this.service.getPetitionDetail(this.petitionId).subscribe(
      (data) => {
        this.response.push(data);
        console.log(this.response);
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setViewData() {
    // console.log(this.history);

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
    this.reporterLocationFullAddress = this.response[0].reporterLocation.fullAddress;
    this.result = this.response[0].result;
    this.status = this.response[0].status;
    this.statusDescription = this.response[0].statusDescription;
    this.tagName = this.response[0].tag.name;
    this.takePlaceAtFullAddress = this.response[0].takePlaceAt.fullAddress;
    this.takePlaceOn = this.response[0].takePlaceOn;
    this.title = this.response[0].title;
  }

  getPetitionHistory() {
    // tslint:disable-next-line:max-line-length
    this.service
      .getPetitionHistory(
        this.groupId,
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
          // const size = data.numberOfElements;
          // for (let i = 0; i < size; i++) {
          //   this.history.push(data.content[i]);
          // }
          // console.log(history);
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
        this.groupId,
        this.petitionId,
        this.pageToGetHistory,
        this.sizePerPageHistory
      )
      .subscribe(
        (data) => {
          const size = data.numberOfElements;
          for (let i = 0; i < size; i++) {
            this.history.push(data.content[i]);
          }
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
    !!node.children && node.children.length > 0;

  updatePetition(id, name): void {
    this.service.updateRecord(id, name);
  }

  deletePetition(id, name): void {
    this.service.deleteRecord(id, name);
  }

  acceptPetition(id, name): void {
    this.service.acceptPetitionDialog(id, name);
  }

  addComment(id, name): void {
    this.service.addComment(id, name);
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
}
