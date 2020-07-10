import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-preview-lightbox',
  templateUrl: './preview-lightbox.component.html',
  styleUrls: ['./preview-lightbox.component.scss']
})
export class PreviewLightboxComponent implements OnInit {
  taskId: string;
  selectedURL: string;
  fileUpload: ImageInfo[];

  constructor(public dialogRef: MatDialogRef<PreviewLightboxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmLightboxDialogModel) {
    this.taskId = data.taskId;
    this.selectedURL = data.imageURL;
    this.fileUpload = data.fileUpload;
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    nav: false,
    navText: ['❮', '❯']
  };

  ngOnInit(): void {
    console.log(this.fileUpload);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  openImage(url): void {
    this.selectedURL = url;
  }
}

export class ConfirmLightboxDialogModel {
  constructor(public taskId: string,
              public imageURL: string,
              public fileUpload: ImageInfo[]) { }
}
