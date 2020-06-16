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
import {
  PetitionElement,
  PETITION_DATA,
  Comments,
  TREE_DATA,
} from 'src/app/data/schema/petition-element';

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
  petition: PetitionElement;
  isExpand = true;
  status: number;

  constructor(private actRoute: ActivatedRoute, private dialog: MatDialog) {
    this.petitionId = this.actRoute.snapshot.params.id;
    this.getPetition(this.petitionId);
    this.status = this.getState(this.petition.status);
    this.commentDataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    const id = this.petitionId;
    if (id === undefined) {
      console.log('ID không xác định');
    }
  }

  isExpandToggle() {
    this.isExpand = !this.isExpand;
  }

  hasChild = (_: number, node: Comments) =>
    !!node.children && node.children.length > 0;

  openDialogUpdatePetition() {
    const dialogRef = this.dialog.open(EditPetitionComponent, {
      width: '80%',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }

  openDialogAcceptPetition() {
    const dialogRef = this.dialog.open(AcceptPetitionComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }

  openDialogDelelePetition() {
    const dialogRef = this.dialog.open(DeletePetitionComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }

  openDialogCommentPetition() {
    const dialogRef = this.dialog.open(CommentPetitionComponent, {
      maxWidth: '80%',
      minWidth: '60%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
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
    if (status === 'Chờ nhận xử lý') {
      return 0;
    } else if (status === 'Chờ xử lý') {
      return 1;
    } else {
      return 2;
    }
  }
}
