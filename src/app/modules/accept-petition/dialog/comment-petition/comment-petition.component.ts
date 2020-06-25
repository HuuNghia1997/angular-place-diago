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

  ngOnInit(): void {}

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  // add comment
  addCommentPetition(requestBody) {
    this.service.addCommentPetition(requestBody).subscribe(
      (data) => {
        // Close dialog, return true
        let result = {
          body: requestBody,
          data: data,
        };
        this.dialogRef.close(result);
      },
      (err) => {
        // Close dialog, return false
        this.dialogRef.close(false);
        // Call api delete file
      }
    );
  }

  onConfirm(): void {
    this.formToJSON();
  }

  formToJSON() {
    const formObject = this.commentForm.getRawValue();

    formObject.groupId = 0;

    formObject.itemId = this.petitionId;

    formObject.user = {
      id: '12345g1e810c19729de860ea',
      fullname: 'Nguyễn Văn A',
    };

    const resultJson = JSON.stringify(formObject, null, 2);

    console.log(resultJson);
    // this.postPetition(resultJson);
  }
}

export class ConfirmCommentDialogModel {
  constructor(public title: string, public id: string) {}
}
