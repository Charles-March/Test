const settings = require('electron-settings');
const electron = require('electron');
const { app, Menu, ipcMain } = electron;

import { Application } from './application';

export class OptionWindow {

    private static win: Electron.BrowserWindow;

    static run(): void{

        if(!this.win || this.win.isDestroyed()){
            this.win = new electron.BrowserWindow({
                width: 800,
                height: 500,
                resizable: false,
                center: true,
                parent: electron.BrowserWindow.getFocusedWindow(),
                darkTheme: true,
                skipTaskbar: true,
                show: false
            });

            this.win.on('close', (event:any) => {
                console.log('prevent closing');
                Application.reloadSettings();
                this.win.hide();
                return event.preventDefault();
            });

            this.win.loadURL(`file://${Application.appPath}/out/browser/index.html#/option`);

            ipcMain.on('validate-option', (event, arg) => {
                //this.application.reloadSettings();
                this.win.close();
            });

            ipcMain.on('reset-option', (event, arg) => {
                //this.application.reloadSettings();
                console.log('receive->reset-option');
                settings.resetToDefaultsSync();
                //this.application.reloadSettings();
                this.win.webContents.send('reload-settings');
            });

            this.win.show();
        }else{
            this.win.show();
            this.win.focus();
        }
    }
}
