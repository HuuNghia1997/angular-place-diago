import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

function readBase64(file): Promise<any> {
  const reader  = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('load', function() {
      resolve(reader.result);
    }, false);

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('error', function(event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-update-result',
  templateUrl: './update-result.component.html',
  styleUrls: ['./update-result.component.scss']
})
export class UpdateResultComponent implements OnInit {

  Result = {
    content: 'Kính gửi ông/bà, phản ánh của ông/bà đã được xử lý xong.\n Thủ trưởng cơ quan hành chính nhà nước có trách nhiệm tổ ' +
            'chức công khai kết quả xử lý phản ánh, kiến nghị của cá nhân, tổ chức về quy định hành chính. Việc công khai được thực ' +
            'hiện thông qua một hoặc nhiều hình thức.',
    publicized: 'true'
  };

  checked = this.Result.publicized;

  constructor() { }

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt']
  });
  public hasBaseDropZoneOver = false;

  ngOnInit(): void {
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileSelected(event: any) {
    const file: File = event[0];
    // console.log(file);
    // tslint:disable-next-line:only-arrow-functions
    readBase64(file).then(function(data) {
      // console.log(data);
    });
  }

}
