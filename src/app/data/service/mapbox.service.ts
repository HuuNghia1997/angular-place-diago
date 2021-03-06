import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MapboxService {


  centerPoint = [];
  private map: mapboxgl.Map;
  geocoder: google.maps.Geocoder;
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
    this.geocoder = new google.maps.Geocoder();
  }
  geocode(latLng): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === "OK") {
          if (results[0]) {
            observer.next(results[0].formatted_address);
            observer.complete();
          } else {
            window.alert("No results");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });

    });
  }

  buildMap(center) {
    const style = 'mapbox://styles/mapbox/streets-v11';
    const longitude = 106.3713;
    const latitude = 10.3629;
    const zoom = 13;
    this.map = new mapboxgl.Map({
      container: 'map',
      style,
      zoom,
      center: [longitude, latitude],
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
