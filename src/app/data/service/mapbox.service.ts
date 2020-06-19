import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private map: mapboxgl.Map;

  searchedPlace = new BehaviorSubject<string>('');
  currentPlace = this.searchedPlace.asObservable();

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  buildMap() {
    const style = 'mapbox://styles/mapbox/streets-v11';
    const longitude = 106.3713;
    const latitude = 10.3629;
    const zoom = 13;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: style,
      zoom: zoom,
      center: [longitude, latitude],
    });

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      getItemValue: function (item) {
        document.getElementById('placeName').innerHTML = item.place_name;
        document.getElementById('coordinate').innerHTML =
          '(' + item.center[0] + ', ' + item.center[1] + ')';

        return item.place_name;
      },
      mapboxgl: mapboxgl,
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
}
