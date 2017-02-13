import {Component, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit{
  constructor(
      private translate: TranslateService,
      private settingsService: SettingsService,
      private ipcRendererService: IpcRendererService
  ){}

  ngOnInit(){
    this.translate.addLangs(["en", "fr", "es"]);
    this.translate.setDefaultLang(this.settingsService.language);

    this.ipcRendererService.on('reload-settings', () => {
      this.translate.use(this.settingsService.language);
    });
  }

}
