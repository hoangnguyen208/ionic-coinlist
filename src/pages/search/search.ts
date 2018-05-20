import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { DataProvider } from "../../providers/data/data";
import { Storage } from "@ionic/storage";
import { LoadingController } from "ionic-angular";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  objectKeys = Object.keys;
  likedCoins = [];
  raw = [];
  liked = [];
  allCoins: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loading: LoadingController,
    private data: DataProvider,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    let loader = this.loading.create({
      content: "Refreshing...",
      spinner: "bubbles"
    });

    loader.present().then(() => {
      this.storage.get('likedCoins').then(val => {
        this.likedCoins = val;
      });

      this.data.allCoins().subscribe(res => {
        this.raw = res['Data'];
        this.allCoins = res['Data'];
        loader.dismiss();
        
        this.storage.get('likedCoins').then(val => {
          this.liked = val;
        })
      })
    });
  }

  addCoin(coin) {
    this.likedCoins.push(coin);
    this.storage.set('likedCoins', this.likedCoins);
  }

  searchCoins(ev: any) {
    let val = ev.target.value;
    this.allCoins = this.raw;

    if (val && val.trim() !== '') {
      const filtered = Object.keys(this.allCoins)
        .filter(key => val.toUpperCase().includes(key))
        .reduce((obj, key) => {
          obj[key] = this.allCoins[key];
          return obj;
        }, {});

      this.allCoins = filtered;
    }
  }
}
