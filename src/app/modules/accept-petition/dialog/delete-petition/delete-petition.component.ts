import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';

@Component({
  selector: 'app-delete-petition',
  templateUrl: './delete-petition.component.html',
  styleUrls: ['./delete-petition.component.scss'],
})
export class DeletePetitionComponent implements OnInit {
  // Khởi tạo
  petition = [];
  petitionId: string;
  petitionTitle: string;

  // Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  cancelForm = new FormGroup({
    content: new FormControl(''),
    sendSms: new FormControl(''),
    isPublic: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogModel,
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<DeletePetitionComponent>
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
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setViewData() {
    this.petitionTitle = this.petition[0].title;

    let smsDescription: string;
    let publicDescription: string;

    if (this.petition[0].sendSms) {
      smsDescription = 'Gửi tin nhắn SMS';
    }

    if (this.petition[0].isPublic) {
      publicDescription = 'Công khai phản ánh';
    }

    this.cancelForm = new FormGroup({
      content: new FormControl(''),
      sendSms: new FormControl(smsDescription),
      isPublic: new FormControl(publicDescription),
    });
  }

  cancel(requestBody) {
    this.service.cancel(requestBody, this.petitionId).subscribe((data) => {
      if (data.affectedRows !== 0) {
        return true;
      }
    });

    return false;
  }

  // Add comment
  comment(requestBody) {
    this.service.comment(requestBody).subscribe();
  }

  onConfirm(): void {
    this.setFormObject();
  }

  setFormObject() {
    const formObject = this.cancelForm.getRawValue();

    formObject.agencyId = this.petition[0].agency.id;
    formObject.agencyName = this.petition[0].agency.name;

    // Set sendSms
    if (formObject.sendSms) {
      formObject.sendSms = true;
    } else {
      formObject.sendSms = false;
    }

    // Set isPublic
    if (formObject.isPublic) {
      formObject.isPublic = true;
    } else {
      formObject.isPublic = false;
    }

    // Set comment
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

    if (this.cancel(formObject)) {
      this.comment(commentObject);
    }
  }

  onDismiss(): void {
    // Close dialog
    this.dialogRef.close();
  }
}
export class ConfirmDeleteDialogModel {
  constructor(
    public title: string,
    public message: string,
    public id: string
  ) {}
}
