import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AllPetitionService } from 'src/app/data/service/all-petition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-lightbox',
  templateUrl: './preview-lightbox.component.html',
  styleUrls: ['./preview-lightbox.component.scss']
})
export class PreviewLightboxComponent implements OnInit {
  fileURL: string;
  fileId: string;
  fileUpload: ImageInfo[];
  selectedURL: any;
  fileType: string;
  fileName: string;

  constructor(public dialogRef: MatDialogRef<PreviewLightboxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmLightboxDialogModel,
              private service: AllPetitionService,
              private sanitizer: DomSanitizer) {
    this.fileURL = data.fileURL;
    this.fileId = data.fileId;
    this.fileUpload = data.fileUpload;
    this.fileName = data.fileName;
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    nav: false,
    navText: ['❮', '❯']
  };

  ngOnInit(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.fileUpload.length; i++) {
      const fileExtension = this.fileUpload[i].url.substring(this.fileUpload[i].url.indexOf(':') + 1, this.fileUpload[i].url.indexOf('/'));
      this.fileUpload[i]['type'] = fileExtension;
    }
    this.openImage(this.fileURL, this.fileId, this.fileName);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  openImage(url, id, name): void {
    this.fileName = name;
    this.fileType = url.substring(url.indexOf(':') + 1, url.indexOf('/'));
    if (this.fileType === 'video' || this.fileType === 'audio') {
      this.service.getImage(id).subscribe(data => {
        const dataType = data.type;
        const binaryData = [];
        binaryData.push(data);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        document.body.appendChild(downloadLink);
        const blobURL: any = this.sanitizer.bypassSecurityTrustUrl(downloadLink.href);
        this.selectedURL = blobURL;
        window.open(blobURL.changingThisBreaksApplicationSecurity, '_blank');
      });
    } else {
      this.selectedURL = url;
    }
  }

  bypassSecurityTrustUrl(base64URL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64URL);
  }
}

export class ConfirmLightboxDialogModel {
  constructor(public fileURL: string,
              public fileId: string,
              public fileUpload: ImageInfo[],
              public fileName: string) { }
}
