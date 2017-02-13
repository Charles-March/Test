const settings = require('electron-settings');
const electron = require('electron');
const { app, Menu, ipcMain } = electron;

import { Application } from './application';

export class ChangeLogWindow {

    private static win: Electron.BrowserWindow;

    static run(): void{
        if(!this.win || this.win.isDestroyed()) {

            this.win = new electron.BrowserWindow({
                width: 500,
                height: 800,
                resizable: true,
                center: true,
                parent: electron.BrowserWindow.getFocusedWindow(),
                darkTheme: true,
                skipTaskbar: true,
                show: false,
                title: 'ChangeLog',
            });

            this.win.loadURL(`file://${Application.appPath}/out/browser/index.html#/changelog`);

            this.win.setMenu(null);

            this.win.on('close', (event:any) => {
                this.win.hide();
                return event.preventDefault();
            });


            this.win.show();
        }else{
            this.win.show();
            this.win.focus();
        }
    }
}
