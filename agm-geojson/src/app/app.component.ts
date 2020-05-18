import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { Marker } from './models/marker.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vett.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 8;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  markers: Marker[];  //Vettore con tutti i marker
  obsGeoData: Observable<GeoFeatureCollection>;
  obsCiVett : Observable<Ci_vettore[]>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;

  constructor(public http: HttpClient) {
  
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    

    console.log(this.geoJsonObject)

    /*for (let feature of this.geoJsonObject.features) {
      let lng = feature.geometry.coordinates[0][0][0];
      let lat = feature.geometry.coordinates[0][0][1];
      let id = String(this.geoJsonObject.features[0].properties.id);
      let marker: Marker = new Marker(lat, lng, id);
      this.markers.push(marker);
    }*/
  }

  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    console.log(data);
    this.markers = [];
  
    for (const iterator of data) {
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      this.markers.push(m);
    }
    
  }

  ngOnInit() {
    this.obsGeoData = this.http.get<GeoFeatureCollection>("http://localhost:3000");
    this.obsGeoData.subscribe(this.prepareData);

    this.obsCiVett = this.http.get<Ci_vettore[]>("http://localhost:3000/ci_vettore/90");
    this.obsCiVett.subscribe(this.prepareCiVettData);
    //Uso di un ciclo foreach per riempire i marker
  }

  styleFunc = (feature) => {
    /*console.log(feature.i.id)
    let newColor = "#FF0000"; //RED
    if (feature.i.id == 0) newColor = "#00FF00"; //GREEN
    else newColor = "#0000FF"; //BLUE*/

    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }

}


// future use 


/*constructor(public http: HttpClient)
  {
    //this.obsGeoJson = http.get<GeoJson>("https://my-json-server.typicode.com/malizia-g/fine_anno/relab_first_json");
    //this.obsGeoJson.subscribe(this.getGeoData);

  }

  getGeoData = (newData : GeoJson)=>
  {
    this.geoJsonObject = GEOJSON;
  }*/

