import {NgModule, APP_INITIALIZER, ModuleWithProviders} from '@angular/core';
import { SettingsService } from './settings/settings.service';
import { IpcRendererService } from './electron/ipcrenderer.service';
import {ApplicationService} from "./electron/application.service";
import {CommonModule} from "@angular/common";
import {NeutrinoService} from "./electron/neutrino.service";

@NgModule({})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                SettingsService,
                IpcRendererService,
                NeutrinoService,
                ApplicationService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: (config: ApplicationService) => () => config.load(),
                    deps: [ApplicationService],
                    multi: true
                },
            ]
        };
    }
}
