import { Component, OnInit, ElementRef, Renderer } from "@angular/core";
import { ModalController, NavController, ScrollEvent } from "ionic-angular";
import { AddPlacePage } from "../add-place/add-place";
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";
import { PlacePage } from "../place/place";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  fab: any;
  addPlacePage: any = AddPlacePage;
  places: Place[] = [];
  isFabHidden: boolean = false;

  constructor(
    public navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private renderer: Renderer,
    private element: ElementRef
  ) {}

  ngOnInit() {
    this.placesService.fetchPlaces().then((places: Place[]) => {
      this.places = places;
    });
    this.fab = this.element.nativeElement.getElementsByClassName('fab')[0];
  }

  ionViewWillEnter() {
    this.places = this.placesService.loadPlaces();
  }

  onOpenPlace(place: Place, index: number) {
    const modal = this.modalCtrl.create(PlacePage, {
      place: place,
      index: index
    });
    modal.present();
  }

  onScroll(event: ScrollEvent) {
    if(event.directionY == 'down' && !this.isFabHidden) {
      this.renderer.setElementStyle(this.fab, 'transform', 'translateY(75px)');
      this.isFabHidden = true;
    } else if(event.directionY == 'up' && this.isFabHidden) {
      this.renderer.setElementStyle(this.fab, 'transform', 'translateY(0px)');
      this.isFabHidden = false;
    }
  }
}
