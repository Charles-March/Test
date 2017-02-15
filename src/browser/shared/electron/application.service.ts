import {Injectable} from '@angular/core';
import {IpcRendererService} from "./ipcrenderer.service";

@Injectable()
export class ApplicationService {

    public website: string;
    public gamePath: string = "";
    public buildVersion: string;
    public appVersion: string;
    public appPath: string;
    public vipStatus: number;

    constructor(private ipcRendererService: IpcRendererService) {
    }

    public load(): void {
        let config = this.ipcRendererService.sendSync('load-config');
        this.gamePath = config.gamePath;
        this.buildVersion = config.buildVersion;
        this.appVersion = config.appVersion;
        this.appPath = config.appPath;
        this.vipStatus = config.vipStatus;
        this.website = config.website;
    }

}