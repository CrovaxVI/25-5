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
circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
  circleLng: number = 0;
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi
  radius : number = this.maxRadius; //Memorizzo il raggio del cerchio

 mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat; //Queste sono le coordinate cliccate
    this.circleLng = $event.coords.lng; //Sposto il centro del cerchio qui
    this.lat = this.circleLat; //Sposto il centro della mappa qui
    this.lng = this.circleLng;
    this.zoom = 15;  //Zoom sul cerchio
  }
circleRedim(newRadius : number){
    console.log(newRadius) //posso leggere sulla console il nuovo raggio
    this.radius = newRadius;  //Ogni volta che modifico il cerchio, ne salvo il raggio
  }

circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter); //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);

    this.circleLat = circleCenter.coords.lat; //Aggiorno le coordinate del cerchio
    this.circleLng = circleCenter.coords.lng; //Aggiorno le coordinate del cerchio

    //Non conosco ancora le prestazioni del DB, non voglio fare ricerche troppo onerose
    if(this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
       this.radius = this.maxRadius;
    }
    let raggioInGradi = (this.radius * 0.00001)/1.1132;
//Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo
//cambiaFoglio poichè riceverò lo stesso tipo di dati
//Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario
    this.obsCiVett = this.http.get<Ci_vettore[]>(`http://TUO_URL/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);
    console.log ("raggio in gradi " + (this.radius * 0.00001)/1.1132)

    //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio
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
let raggioInGradi = (this.radius * 0.00001)/1.1132;
//Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo
//cambiaFoglio poichè riceverò lo stesso tipo di dati
//Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario
    this.obsCiVett = this.http.get<Ci_vettore[]>(`http://TUO_URL/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`);
    this.obsCiVett.subscribe(this.prepareCiVettData)
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
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-ecffcf4b-67ec-497e-b367-d1da5f119cff.ws-eu01.gitpod.io");
    this.obsGeoData.subscribe(this.prepareData);

    this.obsCiVett = this.http.get<Ci_vettore[]>("https://3000-ecffcf4b-67ec-497e-b367-d1da5f119cff.ws-eu01.gitpod.io/ci_vettore/90");
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

