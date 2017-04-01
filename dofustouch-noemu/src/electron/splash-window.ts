import {Application} from "./application";
const settings = require('electron-settings');
import electron = require("electron");
import {BrowserWindow} from 'electron';

export class SplashWindow {
    public static run(): Electron.BrowserWindow {

        // create splash screen
        let splashWindow = new electron.BrowserWindow({
            width: 250,
            height: 250,
            center: true,
            movable: true,
            alwaysOnTop: true,
            resizable: false,
            frame: false,
            transparent: true
        });

        splashWindow.loadURL(`file://${Application.appPath}/out/browser/splash.html#/`);
        splashWindow.show();
        splashWindow.setMenu(null);

        return splashWindow;
    }
}