import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PetitionService } from 'src/app/data/service/petition.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';

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
  group: Number;

  constructor(public dialogRef: MatDialogRef<PreviewLightboxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmLightboxDialogModel,
              private service: AcceptPetitionService,
              private sanitizer: DomSanitizer) {
    this.fileURL = data.fileURL;
    this.fileId = data.fileId;
    this.fileUpload = data.fileUpload;
    this.fileName = data.fileName;
    this.group = data.group;
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', '']
  }

  ngOnInit(): void {
    this.openImage(this.group, this.fileId, this.fileName, this.fileURL);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  openImage(group, id, name, url): void {
    this.fileName = name;
    if (group === 2 || group === 3) {
      this.service.getFile(id).subscribe(data => {
        const dataType = data.type;
        const binaryData = [];
        binaryData.push(data);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        document.body.appendChild(downloadLink);
        const blobURL: any = this.sanitizer.bypassSecurityTrustUrl(downloadLink.href);
        this.selectedURL = blobURL;
        window.open(blobURL.changingThisBreaksApplicationSecurity,'_blank');
      });
    } else {
      this.selectedURL = url;
    }
  }
}

export class ConfirmLightboxDialogModel {
  constructor(public fileURL: string,
              public fileId: string,
              public fileUpload: ImageInfo[],
              public fileName: string,
              public group: Number) { }
}
