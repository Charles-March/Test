import { Injectable } from '@angular/core';
import {IpcRendererService} from "./ipcrenderer.service";

@Injectable()
export class ApplicationService {

    public gamePath: string = "";
    public buildVersion: string;
    public appVersion: string;
    public appPath: string;
    public vip: boolean;

    constructor(
        private ipcRendererService: IpcRendererService
    ){}

    public load(): void {
        let config = this.ipcRendererService.sendSync('load-config');
        this.gamePath = config.gamePath;
        this.buildVersion = config.buildVersion;
        this.appVersion = config.appVersion;
        this.appPath = config.appPath;
        this.vip = config.vip;
    }

}