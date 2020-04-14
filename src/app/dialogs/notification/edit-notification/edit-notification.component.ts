import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';

// ====================================================== Services
import { NotificationService } from '../../../services/notification.service';

// ====================================================== Environment
import { PICK_FORMATS, notificationCategoryId } from '../../../../environments/environment';

class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd/MM/yyyy', this.locale);;
        } else {
            return date.toDateString();
        }
    }
}

@Component({
    selector: 'app-edit-notification',
    templateUrl: './edit-notification.component.html',
    styleUrls: [
        './edit-notification.component.scss',
        '../add-notification/add-notification.component.scss',
        '../../../app.component.scss'
    ],
    providers: [
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
        DatePipe
    ]
})
export class EditNotificationComponent implements OnInit {
    popupTitle: string;
    uploaded: boolean;
    blankVal: any;
    notificationId: string;
    categoryId = notificationCategoryId;
    accountId = '5e4e0ac92be7bffd22cb4798';

    uploadedImage = [];
    countDefaultImage;
    listTags = [];
    itemsListTags = [];
    files = [];
    urls = [];
    fileNames = [];
    fileNamesFull = [];

    listAgency = [
        { id: 1, imageId: '765f1f77bcf86cd799439011', name: 'UBND Tỉnh Tiền Giang' },
        { id: 2, imageId: '5e806566e0729747af9d136a', name: 'UBND Huyện Cái Bè' },
        { id: 3, imageId: '5e806566e0729747af9d136a', name: 'UBND Thị xã Cai Lậy' }
    ];

    response = [];

    constructor(
        public dialogRef: MatDialogRef<EditNotificationComponent>,
        private service: NotificationService,
        public datepipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateDialogModel
    ) {
        this.popupTitle = data.title;
        this.notificationId = data.id;
    }

    // Form
    public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    updateForm = new FormGroup({
        title: new FormControl(''),
        content: new FormControl(''),
        agency: new FormControl(''),
        tag: new FormControl(''),
        expiredDate: new FormControl(''),
        publish: new FormControl(''),
    });
    title = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
    content = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
    agency = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

    getErrorMessage(id) {
        return this.service.formErrorMessage(id);
    }

    onConfirm(): void {
        if (this.countDefaultImage > 0) {
            this.files.splice(0, this.countDefaultImage);
            if (this.files.length > 0) {
                for (const j of this.files) {
                    this.uploadImage(j);
                }
            } else {
                this.formToJSON();
            }
        } else {
            if (this.files.length > 0) {
                for (const j of this.files) {
                    this.uploadImage(j);
                }
            } else {
                this.formToJSON();
            }
        }
    }

    uploadImage(imgFile) {
        this.service.uploadImages(imgFile, this.accountId).subscribe(data => {
            this.uploadedImage.push(data.id);
            if (this.uploadedImage.length === this.files.length) {
                this.formToJSON();
            }
        }, err => {
            console.log(err);
        });
    }

    formToJSON() {
        const formObj = this.updateForm.getRawValue();

        // Format publish
        if (formObj.publish) {
            formObj.publish = 1;
        } else {
            formObj.publish = 0;
        }

        // Format expiredDate
        formObj.expiredDate = this.datepipe.transform(formObj.expiredDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

        // Add publishedDate
        let newPublishedDate: string;
        newPublishedDate = new Date().toString();
        formObj.publishedDate = this.datepipe.transform(newPublishedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

        // Add agency
        const selectedAgency = formObj.agency;
        formObj.agency = this.listAgency.find(p => p.id == selectedAgency);

        // Add Tags
        for (const i of formObj.tag) {
            // tslint:disable-next-line: triple-equals
            const item = this.listTags.find(p => p.id == i);
            this.itemsListTags.push(item);
        }
        this.itemsListTags = this.itemsListTags.map(item => {
            delete item.parentId;
            delete item.orderNumber;
            delete item.status;
            delete item.createdDate;
            delete item.description;
            return item;
        });
        formObj.tag = this.itemsListTags;

        // Add Image
        formObj.imageId = this.uploadedImage;

        // Final result
        const resultJson = JSON.stringify(formObj, null, 2);

        // console.log(resultJson);

        this.updateNotification(resultJson);
    }

    updateNotification(requestBody) {
        this.service.updateNotification(requestBody, this.notificationId).subscribe(data => {
            // Close dialog, return true
            this.dialogRef.close(true);
        }, err => {
            // Close dialog, return false
            this.dialogRef.close(false);
            // Call api delete file

            console.log(err);
        });
    }

    resetForm(): void {
        this.urls = [];
        this.fileNames = [];
        this.fileNamesFull = [];
        this.uploaded = false;
        this.uploadedImage = [];
        this.files = [];
    }

    // File uploads
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            for (let i = 0; i < event.target.files.length; ++i) {
                this.files.push(event.target.files[i]);
            }
            const filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    this.uploaded = true;
                    this.urls.push(event.target.result);
                };
                if (event.target.files[i].name.length > 20) {
                    // Tên file quá dài
                    const startText = event.target.files[i].name.substr(0, 5);
                    // tslint:disable-next-line:max-line-length
                    const shortText = event.target.files[i].name.substring(event.target.files[i].name.length - 7, event.target.files[i].name.length);
                    this.fileNames.push(startText + '...' + shortText);
                    // Tên file gốc - hiển thị tooltip
                    this.fileNamesFull.push(event.target.files[i].name);
                } else {
                    this.fileNames.push(event.target.files[i].name);
                    this.fileNamesFull.push(event.target.files[i].name);
                }
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
    // Xoá file
    removeItem(index: number) {
        let filesIndex = index;
        if (index == 0) {
            filesIndex = 0;
        }
        this.urls.splice(index, 1);
        this.fileNames.splice(index, 1);
        this.fileNamesFull.splice(index, 1);
        this.files.splice(filesIndex, 1);
        this.uploadedImage.splice(index, 1);
        this.blankVal = '';
    }

    ngOnInit(): void {
        this.getNotificationDetail();
        this.getListTags();
    }

    getListTags() {
        this.service.getListTags(this.categoryId).subscribe(data => {
            const size = data.numberOfElements;
            for (let i = 0; i < size; i++) {
                this.listTags.push(data.content[i]);
            }
        }, err => {
            this.service.checkErrorResponse(err, 2);
        });
    }

    getNotificationDetail() {
        this.service.getNotificationDetail(this.notificationId).subscribe(data => {
            this.response.push(data);
            this.setViewData();
        }, err => {
            console.log(err);
            this.service.checkErrorResponse(err, 3);
        });
    }

    setViewData() {
        let tagSelected = [];
        let sent: boolean;
        for (const item of this.response[0].tag) {
            tagSelected.push(item.id);
        }
        tagSelected = tagSelected.map(String);

        if (this.response[0].publish.status == 0) {
            sent = false;
        } else {
            sent = true;
        }

        this.updateForm = new FormGroup({
            title: new FormControl(this.response[0].title),
            content: new FormControl(this.response[0].content),
            agency: new FormControl('' + this.response[0].agency.id),
            tag: new FormControl(tagSelected),
            expiredDate: new FormControl(new Date(this.response[0].expiredDate)),
            publish: new FormControl(sent),
        });

        this.uploadedImage = this.response[0].imageId;
        this.countDefaultImage = this.uploadedImage.length;

        if (this.response[0].imageId.length > 0) {
            for (const i of this.response[0].imageId) {
                this.service.getImage(i).subscribe(data => {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        this.urls.push(reader.result);
                        this.files.push(reader.result);
                    }, false);
                    if (data) {
                        reader.readAsDataURL(data);
                    }
                }, err => {
                    console.log(err);
                });
                this.service.getImageName_Size(i).subscribe(data => {
                    if (data['filename'].length > 20) {
                        // Tên file quá dài
                        const startText = data['filename'].substr(0, 5);
                        const shortText = data['filename'].substr(data['filename'].length - 7, data['filename'].length);
                        this.fileNames.push(startText + '...' + shortText);
                        // Tên file gốc - hiển thị tooltip
                        this.fileNamesFull.push(data['filename']);
                    } else {
                        this.fileNames.push(data['filename']);
                        this.fileNamesFull.push(data['filename']);
                    }
                }, err => {
                    console.log(err);
                });
            }
        }
        this.uploaded = true;
    }

    onDismiss(): void {
        // Đóng dialog, trả kết quả là false
        this.dialogRef.close();
    }
}
export class ConfirmUpdateDialogModel {
    constructor(public title: string, public id: string) {
    }
}
