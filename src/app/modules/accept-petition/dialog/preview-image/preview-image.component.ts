import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPreviewImageDialogModel
  ) {
    data.images.forEach((item) => {
      let temp = {
        small: item.url,
        medium: item.url,
        big: item.url,
      };
      this.galleryImages.push(temp);
    });
  }

  ngOnInit(): void {
    this.galleryOptions = [
      {
        arrowPrevIcon: 'fa fa-arrow-circle-o-left',
        arrowNextIcon: 'fa fa-arrow-circle-o-right',
        closeIcon: 'fa fa-window-close',
        fullscreenIcon: 'fa fa-arrows',
        spinnerIcon: 'fa fa-refresh fa-spin fa-3x fa-fw',
        previewFullscreen: true,
      },
      {
        breakpoint: 500,
        width: '400px',
        height: '300px',
        thumbnailsColumns: 3,
      },
      { breakpoint: 300, width: '100%', height: '200px', thumbnailsColumns: 2 },
    ];
  }
}

export class ConfirmPreviewImageDialogModel {
  constructor(public images) {}
}
