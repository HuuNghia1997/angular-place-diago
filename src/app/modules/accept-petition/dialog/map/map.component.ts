import { Component, OnInit } from '@angular/core';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(
    private map: MapboxService,
    public dialogRef: MatDialogRef<MapComponent>
  ) {}

  ngOnInit(): void {
    this.map.buildMap();
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
    this.createMessageLongtitude(document.getElementById('longitude').innerHTML);
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }
}
