"use strict";
const settings = require('electron-settings');
const electron = require('electron');
const { app, Menu, ipcMain } = electron;
class OptionWindow {
    constructor(application) {
        this.application = application;
        ipcMain.on('validate-option', (event, arg) => {
            //this.application.reloadSettings();
            this.win.close();
        });
        ipcMain.on('reset-option', (event, arg) => {
            //this.application.reloadSettings();
            console.log('receive->reset-option');
            settings.resetToDefaultsSync();
            this.application.reloadSettings();
            this.win.webContents.send('reload-settings');
        });
    }
    static run(application) {
        if (!this.optionWindow) {
            this.optionWindow = new OptionWindow(application);
        }
        if (this.optionWindow.win) {
            this.optionWindow.win.focus();
            return;
        }
        this.optionWindow.win = new electron.BrowserWindow({
            width: 800,
            height: 500,
            resizable: false,
            center: true,
            parent: electron.BrowserWindow.getFocusedWindow(),
            darkTheme: true,
            skipTaskbar: true,
            show: false
        });
        this.optionWindow.win.on('closed', () => {
            this.optionWindow.application.reloadSettings();
            this.optionWindow.win = null;
        });
        this.optionWindow.win.loadURL(`file://${__dirname}/../browser/index.html#/option`);
        this.optionWindow.win.show();
    }
}
exports.OptionWindow = OptionWindow;

//# sourceMappingURL=option-window.js.map
