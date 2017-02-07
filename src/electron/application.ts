import {ChangeLogWindow} from "./changelog-window";
const settings = require('electron-settings');
import electron = require("electron");
import {app, ipcMain, dialog, BrowserWindow} from 'electron';
import * as request from 'request';
import {checkSettings} from './test/check-settings';

import {DefaultSettings} from './default.settings';
import {GameWindow} from './game-window';
import {UpdateWindow} from './update-window';
import {ISettings} from "../shared/settings";

const neutrino = require("neutrino-metrics");
neutrino("SyxamT87ux");

export class Application {

    public website: string = "http://dofustouch.no-emu.com";
    public static cmdOptions: any;
    public devMode: boolean = false;
    private gameWindows: GameWindow[] = [];
    private updateWindow: UpdateWindow;


    constructor(cmdOptions: any) {
        // set defaults settings
        settings.defaults(DefaultSettings);

        // if wrong settings -> reset
        if(!checkSettings()){
            settings.resetToDefaultsSync();
        }

        Application.cmdOptions = cmdOptions;
        this.devMode = cmdOptions.devmode;
        this.updateWindow = new UpdateWindow(this);
    }

    private getAppVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://itunes.apple.com/lookup?id=1041406978',
                forever: true
            }, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    let bodyParse = JSON.parse(body);
                    resolve(bodyParse.results[0].version);
                } else {
                    reject(error);
                }
            });
        });
    }

    private getBuildVersion(): Promise<string> {
        return new Promise((resolve, reject) => {

            request.get({
                url: 'https://proxyconnection.touch.dofus.com/build/script.js',
                forever: true
            }, (error, response, body) => {

                if (!error && response.statusCode == 200) {
                    const regex = /.*buildVersion=("|')([0-9]*\.[0-9]*\.[0-9]*)("|')/g;
                    let m: RegExpExecArray;

                    m = regex.exec(body.substring(1, 10000));
                    resolve(m[2]);
                } else {
                    reject(error);
                }
            });
        });
    }


    run(): void {
        // get dynamic app and build version (avoid login block)


        let splash = new electron.BrowserWindow({
            width: 250,
            height: 250,
            center: true,
            movable: true,
            alwaysOnTop: true,
            resizable : false,
            frame: false,
            transparent: true
        });

        splash.loadURL(`file://${__dirname}/../browser/splash.html#/`);

        Promise.all([
            this.getAppVersion(),
            this.getBuildVersion(),
        ]).then(([newAppVersion, newBuildVersion]) => {
            settings.setSync('appVersion', newAppVersion);

            splash.hide();

            this.updateWindow.run().then(() => {


                this.addWindow();

                if (this.updateWindow.win) {
                    this.updateWindow.win.close();
                }

                splash.close();

                if (Application.cmdOptions.changelog) {
                    ChangeLogWindow.run(this);
                }
            }).catch((raison: any) => {
                console.log('run update error');
                dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                    type: 'error',
                    title: 'Error',
                    message: raison.toString(),
                    buttons: ['Fermer']
                }, () => {
                    app.exit();
                });
            });

            ipcMain.on('load-config', (event, arg) => {

                let appPath = app.getAppPath();

                if (Application.cmdOptions.devmode) {
                    appPath = __dirname + '/../../';
                }

                event.returnValue = {
                    gamePath: app.getPath('userData') + '/game',
                    appPath: appPath,
                    buildVersion: newBuildVersion,
                    appVersion: newAppVersion,
                    platform: process.platform
                }
            });
        }).catch((raison: any) => {
            splash.close();
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'error',
                title: 'Error',
                message: raison.toString(),
                buttons: ['Fermer']
            }, () => {
                app.exit();
            });
        });

    }

    reloadSettings(): void {

        this.gameWindows.forEach((gWindow) => {
            //gWindow.shortCuts.reload();
            gWindow.reloadSettings();
        });

    }

    addWindow(): void {

        // instance window game
        let gWindow = new GameWindow(this);

        // start the game window
        gWindow.run();

        // add event listenner closed
        gWindow.closed((e) => {
            delete this.gameWindows[this.gameWindows.indexOf(e)];
        });

        // add the game window
        this.gameWindows.push(gWindow);
    }
}
