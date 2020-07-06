import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  address: string;
  latitude: number;
  longitude: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmMapDialogModel,
    private map: MapboxService,
    public dialogRef: MatDialogRef<MapComponent>
  ) {
    this.address = data.address;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }

  ngOnInit(): void {
    this.map.buildMap({ longitude: this.longitude, latitude: this.latitude });
  }

  createMessagePlace(placeName) {
    this.map.changePlace(placeName);
  }

  createMessageLatitude(lat) {
    this.map.changeLatitude(lat);
  }

  createMessageLongtitude(long) {
    this.map.changeLongitude(long);
  }

  search() {
    this.createMessagePlace(document.getElementById('placeName').innerHTML);
    this.createMessageLatitude(document.getElementById('latitude').innerHTML);
    this.createMessageLongtitude(
      document.getElementById('longitude').innerHTML
    );
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }
}

export class ConfirmMapDialogModel {
  constructor(
    public address: string,
    public latitude: number,
    public longitude: number
  ) {}
}
