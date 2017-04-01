import {Application} from "../application";
const settings = require('electron-settings');
import electron = require("electron");
import {BrowserWindow} from 'electron';

export class PromptPassword {

    // Prompt a window to request the master password for multi account
    public static run(): Electron.BrowserWindow {

        let promptWindow: Electron.BrowserWindow;
        
        promptWindow = new BrowserWindow({
            width: 400,
            height: 150,
            title: "DofusTouchNE",
            show: false,
            resizable: false,
            movable: true,
            alwaysOnTop: true,
            frame: true
        });
        
        promptWindow.loadURL(`file://${Application.appPath}/out/electron/prompt-password/prompt-password.html`);
        
        promptWindow.show();
        promptWindow.setMenu(null);

        return promptWindow;
    }

    // Display "wrong password" tip
    public static displayWrongPassword(promptWindow: Electron.BrowserWindow) {
        promptWindow.webContents.send("wrong-password");
    }
}