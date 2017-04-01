"use strict";
const settings = require('electron-settings');
const electron = require('electron');
const { app, Menu, ipcMain } = electron;
class ChangeLogWindow {
    constructor(application) {
        this.application = application;
    }
    static run(application) {
        if (!this.changeLogWindow) {
            this.changeLogWindow = new ChangeLogWindow(application);
        }
        if (this.changeLogWindow.win) {
            this.changeLogWindow.win.focus();
            return;
        }
        this.changeLogWindow.win = new electron.BrowserWindow({
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
        this.changeLogWindow.win.on('closed', () => {
            this.changeLogWindow.win = null;
        });
        this.changeLogWindow.win.loadURL(`file://${__dirname}/../browser/index.html#/changelog`);
        this.changeLogWindow.win.show();
    }
}
exports.ChangeLogWindow = ChangeLogWindow;

//# sourceMappingURL=changelog-window.js.map
