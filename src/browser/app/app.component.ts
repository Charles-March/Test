import { Component } from '@angular/core';
import {TranslateService} from "ng2-translate";
import {ApplicationService} from "../shared/electron/application.service";
import {SettingsService} from "../shared/settings/settings.service";
import {IpcRendererService} from "../shared/electron/ipcrenderer.service";

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
      private ipcRendererService: IpcRendererService
  ){
    translate.addLangs(["en", "fr", "es"]);
    translate.setDefaultLang(this.settingsService.language);

    this.ipcRendererService.on('reload-settings', () => {
      this.translate.use(this.settingsService.language);
    });
  }
}
