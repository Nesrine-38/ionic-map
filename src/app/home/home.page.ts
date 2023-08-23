import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation'; // V6 >
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map?: L.Map

  constructor(private alertCtrl: AlertController) {}

  ionViewWillEnter(){
    this.locateUser()
  }

  showMap(lat: number, lng: number){
    this.map = L.map('mapId').setView([lat,lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.marker(
      [lat,lng],
      {icon: L.icon({iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png'})})
      .addTo(this.map)
    .bindPopup('Chez wam')
    .openPopup();
  }

  ngOnInit(): void {
  }

  private showErrorAlert(){
    this.alertCtrl
    .create({
      header: 'Could not fetch location',
      message:'Please use the map to pick a location'})
    .then(alertEl => alertEl.present())
  }

  private locateUser(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      this.showErrorAlert()
      return;
    }
    Geolocation.getCurrentPosition()
    .then(geoPosition => {
      const coordinates = {
        latitude: geoPosition.coords.latitude,
        longitude: geoPosition.coords.longitude}
        this.showMap(coordinates.latitude, coordinates.longitude)
    })
    .catch(err => this.showErrorAlert())
  }
}
