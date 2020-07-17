import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {


  centerPoint = [];
  private map: mapboxgl.Map;

  searchedPlace = new BehaviorSubject<string>('');
  latitude = new BehaviorSubject<string>('');
  longitude = new BehaviorSubject<string>('');
  currentPlace = this.searchedPlace.asObservable();
  currentLatitude = this.latitude.asObservable();
  currentLongitude = this.longitude.asObservable();

  getCenterPoint() {
    return this.centerPoint;
  }

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  buildMap() {
    const style = 'mapbox://styles/mapbox/streets-v11';
    const zoom = 13;
    const longitude = 10.3629;
    const latitude = 106.3713;
    this.map = new mapboxgl.Map({
      container: 'map',
      style,
      zoom,
      center: [latitude, longitude],
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      getItemValue(item) {
        document.getElementById('placeName').innerHTML = item.place_name;
        this.centerPoint = item.center;
        console.log(this.centerPoint);
        document.getElementById('latitude').innerHTML = item.center[0];
        document.getElementById('longitude').innerHTML = item.center[1];

        return item.place_name;
      },
      mapboxgl,
    });

    this.map.addControl(geocoder);

    this.map.addControl(new mapboxgl.FullscreenControl());

    // Add geolocate control to the map.
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
  }

  // Change searched place name
  changePlace(placeName) {
    this.searchedPlace.next(placeName);
  }

  // Change searched place name
  changeLatitude(latitude) {
    this.latitude.next(latitude);
  }

  // Change searched place name
  changeLongitude(longitude) {
    this.longitude.next(longitude);
  }
}
