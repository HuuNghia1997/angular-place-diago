import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('pacinput') searching: ElementRef;
  @ViewChild('mapId') mapID: ElementRef;
  @ViewChild(GoogleMap) googleMap: GoogleMap;
  @ViewChild(MapInfoWindow) info: MapInfoWindow;
  address = '';
  latitude: number;
  longitude: number;

  lat: number;
  lot = 10.3629;
  itemZoom = 17;
  arr = [];
  bound: google.maps.LatLngBounds;
  // chức năng gg maps
  zoom = 17;
  center: google.maps.LatLngLiteral = { lat: 10.0257944, lng: 105.7723439 };
  markers = [];
  infoContent = '';
  value: string;
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
    this.updateMap();


  }
  ngAfterViewInit(): void {
    this.loadPlaceGoogleMaps();
  }
  updateMap() {
    if (this.address !== '') {
      this.center = { lat: this.latitude, lng: this.longitude };
      this.markers.push({
        position: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        label: {
          color: 'black',
          fontSize: 35,
          text: '.',
        },
        title: '.',
        info: 'Marker info ' + (this.markers.length + 1),

      });
    }
  }
  loadPlaceGoogleMaps() {
    const input = this.searching.nativeElement;
    this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    const autocomplete = new google.maps.places.Autocomplete(this.searching.nativeElement as HTMLInputElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      const address = {
        latitude: place.geometry.location.lat(),
        longitudea: place.geometry.location.lng(),
        fullAddress: place.formatted_address
      };
      if (this.markers.length < 1) {
        this.addMarker(place.name);
      }else{
        this.markers.splice(0, 1);
        this.addMarker(place.name);
      }
      this.ChangeAddress(address);
    });
  }
  ChangeAddress(address) {
    this.map.changePlace(address.fullAddress);
    this.map.changeLatitude(address.latitude);
    this.map.changeLongitude(address.longitudea);
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
  // chức năng gg maps
  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.center = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (this.markers.length < 1) {
      // this.addMarker();
    }else{
      this.markers.splice(0, 1);
      // this.addMarker();
    }

  }
  logCenter() {
    console.log(JSON.stringify(this.googleMap.getCenter()));
  }

  addMarker(title) {
    this.markers.push({
      position: {
        lat: this.center.lat,
        lng: this.center.lng,
      },
      label: {
        color: 'black',
        fontSize: 35,
        text: '.',
      },
      title: '.',
      info: title,
    });
  }
  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
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
  ) { }
}
