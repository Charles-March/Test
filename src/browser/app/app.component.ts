import { Component } from '@angular/core';
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'application',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(
      private translate: TranslateService
  ){
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang('fr');
  }
}
