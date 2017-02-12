import { Component } from '@angular/core';
import {TranslateService} from "ng2-translate";
import {ApplicationService} from "../shared/electron/application.service";
import {SettingsService} from "../shared/settings/settings.service";

@Component({
  selector: 'application',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(
      private translate: TranslateService,
      private settingsService: SettingsService,
  ){
    translate.addLangs(["en", "fr"]);
    translate.setDefaultLang(this.settingsService.language);
  }
}
