import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PetitionService } from 'src/app/data/service/petition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/data/service/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  comment = new FormGroup({
    groupId: new FormControl(''),
    itemId: new FormControl(''),
    user: new FormGroup({
      id: new FormControl(''),
      fullname: new FormControl('')
    }),
    content: new FormControl('')
  });

  petitionId: string;
  fullname: string;

  constructor(private service: PetitionService,
              public dialogRef: MatDialogRef<CommentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommentDialogModel,
              private keycloak: KeycloakService,
              private userService: UserService) {
    this.petitionId = data.petitionId;
  }

  ngOnInit(): void {
    this.keycloak.loadUserProfile().then(usr => {
      // tslint:disable-next-line: no-string-literal
      this.userService.getUserInfo(usr['attributes'].user_id).subscribe(info => {
        // tslint:disable-next-line: no-string-literal
        this.fullname = info['fullname'];
      });
    });
  }

  postComment(requestBody) {
    this.service.postComment(requestBody).subscribe(res => {
      this.dialogRef.close(true);
    }, err => {
      this.dialogRef.close(false);
      console.error(err);
    });
  }

  formToJson() {
    const formObj = this.comment.getRawValue();
    formObj.groupId = 1;
    formObj.itemId = this.petitionId;
    formObj.user.id = this.petitionId;

    formObj.user.fullname = this.fullname;

    formObj.content = formObj.content;

    const result = JSON.stringify(formObj, null, 2);
    this.postComment(result);
  }

  onDismiss() {
    this.dialogRef.close();
  }

}

export class CommentDialogModel {
  constructor(public title: string,
              public petitionId: string) { }
}
