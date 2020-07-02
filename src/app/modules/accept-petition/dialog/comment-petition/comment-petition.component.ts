import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-petition',
  templateUrl: './comment-petition.component.html',
  styleUrls: ['./comment-petition.component.scss'],
})
export class CommentPetitionComponent implements OnInit {
  // Khởi tạo
  petition = [];
  petitionId: string;

  // Comment Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  commentForm = new FormGroup({
    content: new FormControl(''),
  });

  // Khởi tạo tham số cho để validate data
  content = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmCommentDialogModel,
    public dialogRef: MatDialogRef<CommentPetitionComponent>,
    private service: AcceptPetitionService
  ) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getPetitionDetail();
  }

  getPetitionDetail() {
    this.service.getPetitionDetail(this.petitionId).subscribe(
      (data) => {
        this.petition.push(data);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  comment(requestBody) {
    this.service.comment(requestBody).subscribe();
  }

  onConfirm(): void {
    this.formToJSON();
  }

  formToJSON() {
    const formObject = this.commentForm.getRawValue();

    let commentObject = {
      groupId: 1,
      itemId: this.petitionId,
      user: {
        id: this.petition[0].reporter.id,
        fullname: this.petition[0].reporter.fullname,
      },
      content: formObject.content,
    };

    const resultJson = JSON.stringify(commentObject, null, 2);

    // console.log(resultJson);

    this.comment(resultJson);
  }
}

export class ConfirmCommentDialogModel {
  constructor(public title: string, public id: string) {}
}
