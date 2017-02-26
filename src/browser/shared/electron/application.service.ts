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
    public vipDate: Date;

    constructor(private ipcRendererService: IpcRendererService) {
    }

    public load(): void {
        let config = this.ipcRendererService.sendSync('load-config');
        this.gamePath = config.gamePath;
        this.buildVersion = config.buildVersion;
        this.appVersion = config.appVersion;
        this.appPath = config.appPath;
        this.vipStatus = config.vipStatus;
        this.vipDate = new Date(config.vipDate*1000);
        this.website = config.website;
    }

    public vipText (): string {
        let status = [null, 'Tiwabbit', 'Wabbit', 'Grand Pa Wabbit', '42', 'Boss Wa Wabbit', 'Cresus MasterRace'];

        return status[this.vipStatus];
    }

}