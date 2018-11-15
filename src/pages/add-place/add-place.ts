import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController,
} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {SetLocationPage} from "../set-location/set-location";
import {Location} from "../../models/location";
import {Geolocation} from "@ionic-native/geolocation";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {PlacesService} from "../../services/places";
import {File} from "@ionic-native/file";

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = false;
  imageUrl = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = '';
    this.locationIsSet = false;
  }


  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss((data: { location: Location }) => {
      if (data) {
        this.location = data.location;
        this.locationIsSet = true;
      }
    });
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your location...'
    });
    loader.present();
    this.geolocation.getCurrentPosition()
      .then(location => {
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
        loader.dismiss();
      })
      .catch(err => {
        console.log(err);
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Unable to get location, please enter manually',
          duration: 2500
        });
        toast.present();
      });
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then((imageData) => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, currentName)
          .then(data => {
            this.imageUrl = data.nativeURL
            this.camera.cleanup();
          })
          .catch(err => {
            this.imageUrl = '';
            this.toastCtrl.create({message: 'Unable to save image', duration: 2500}).present();
            this.camera.cleanup();
          });
        this.imageUrl = imageData;
      })
      .catch(err => {
        this.imageUrl = '';
        this.toastCtrl.create({message: 'Unable to take image', duration: 2500}).present();
        this.camera.cleanup();
      });
  }


}
