import {ChangeLogWindow} from "./changelog-window";
const settings = require('electron-settings');
const i18n = require('node-translate');
import electron = require("electron");
import {app, ipcMain, dialog, BrowserWindow} from 'electron';
import * as request from 'request';
import {checkSettings} from './test/check-settings';

import {DefaultSettings} from './default.settings';
import {GameWindow} from './game-window';
import {UpdateWindow} from './update-window';
import {ISettings} from "../shared/settings";

export class Application {

    public static website: string = "http://api.no-emu.com";
    public static cmdOptions: any;
    public static appPath: string;
    private static gameWindows: GameWindow[] = [];

    public static init(cmdOptions: any) {

        // retrieve cmd option
        this.cmdOptions = cmdOptions;

        // set application path
        this.appPath = app.getAppPath();
        if (this.cmdOptions.devmode) {
            this.appPath = __dirname + '/../..';
        }

        // set defaults settings
        settings.defaults(DefaultSettings);

        // if wrong settings -> reset
        settings.applyDefaultsSync();
        if (!checkSettings()) {
            settings.resetToDefaultsSync();
        }

        if (!settings.getSync('language')) {
            let local = app.getLocale();

            if (local.search('en') !== -1) {
                settings.setSync('language', 'en');
            } else if (local.search('fr') !== -1) {
                settings.setSync('language', 'fr');
            } else if (local.search('es') !== -1) {
                settings.setSync('language', 'es');
            }
        }

        // set language
        i18n.requireLocales({
            'en': require(`${Application.appPath}/i18n/electron/en`),
            'fr': require(`${Application.appPath}/i18n/electron/fr`),
            'es': require(`${Application.appPath}/i18n/electron/es`)
        });

        i18n.setLocale(settings.getSync('language'));

        return this;
    }

    private static getAppVersion(): Promise<string> {
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

    private static getVipStatus(): Promise<number> {
        return new Promise((resolve, reject) => {

            if (!settings.getSync('vip_id')) {
                return resolve(null);
            }

            request.get({
                url: `${this.website}/tipeee.php?vip_id=${settings.getSync('vip_id')}`,
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let bodyParse = JSON.parse(body);

                    resolve(bodyParse.status);
                } else {
                    reject(error);
                }
            });
        });
    }

    private static getBuildVersion(): Promise<string> {
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

    private static getRemoteVersion(): Promise<{appVersion: string, buildVersion: string}> {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${this.website}/version.json`,
                forever: true
            }, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    let bodyParse = JSON.parse(body);
                    resolve(bodyParse);
                } else {
                    reject(error);
                }
            });
        });
    }


    public static run(): void {


        // skipupdate in dev mod
        if (this.cmdOptions.skipupdate) {
            ipcMain.on('load-config', (event, arg) => {

                event.returnValue = {
                    gamePath: app.getPath('userData') + '/game',
                    appPath: Application.appPath,
                    buildVersion: settings.getSync('buildVersion'),
                    appVersion: settings.getSync('appVersion'),
                    platform: process.platform,
                    language: settings.getSync('language'),
                    vip: false
                }
            });

            this.addWindow();
            return;
        }

        // create splash screen
        let splash = new electron.BrowserWindow({
            width: 250,
            height: 250,
            center: true,
            movable: true,
            alwaysOnTop: true,
            resizable: false,
            frame: false,
            transparent: true
        });
        splash.loadURL(`file://${Application.appPath}/out/browser/splash.html#/`);

        // retrieve remote version
        Promise.all([
            this.getRemoteVersion(),
            this.getVipStatus(),
        ]).then(([version, vipStatus]) => {
            settings.setSync('appVersion', version.appVersion);

            // hide slpash screen
            splash.hide();


            // run update
            UpdateWindow.run().then(() => {

                // start windows
                this.addWindow();

                // close update window
                if (UpdateWindow.win) {
                    UpdateWindow.win.close();
                }

                // close slpash
                splash.close();

                if (Application.cmdOptions.changelog) {
                    ChangeLogWindow.run();
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

                event.returnValue = {
                    gamePath: app.getPath('userData') + '/game',
                    appPath: Application.appPath,
                    buildVersion: version.buildVersion,
                    appVersion: version.appVersion,
                    platform: process.platform,
                    language: settings.getSync('language'),
                    vipStatus: vipStatus,
                    website: this.website
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

    public static reloadSettings(): void {

        this.gameWindows.forEach((gWindow) => {

            if (!settings.getSync('language')) {
                let local = app.getLocale();

                if (local.search('en') !== -1) {
                    settings.setSync('language', 'en');
                } else if (local.search('fr') !== -1) {
                    settings.setSync('language', 'fr');
                } else if (local.search('es') !== -1) {
                    settings.setSync('language', 'es');
                }
            }

            i18n.setLocale(settings.getSync('language'));
            gWindow.reloadSettings();
        });

    }

    public static addWindow(): void {

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
