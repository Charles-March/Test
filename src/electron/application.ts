import {ChangeLogWindow} from "./changelog-window";
const settings = require('electron-settings');
const i18n = require('node-translate');
import electron = require("electron");
const updater              = require('electron-simple-updater');
import {app, ipcMain, dialog, BrowserWindow} from 'electron';
import * as request from 'request';
import {checkSettings} from './test/check-settings';

import {DefaultSettings} from './default.settings';
import {GameWindow} from './game-window';
import {UpdateWindow} from './update-window';
import {ISettings} from "./settings";

import {PromptPassword} from './prompt-password/prompt-password';
import {Crypt} from "../shared/crypt";
import {SplashWindow} from "./splash-window";

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
            } else {
                settings.setSync('language', 'en');
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

    private static getVipStatus(): Promise<{status: number, date: number}> {
        return new Promise((resolve, reject) => {

            if (!settings.getSync('vip_id')) {
                return resolve({status: null, date: null});
            }

            request.get({
                url: `${this.website}/tipeee.php?vip_id=${settings.getSync('vip_id')}`,
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let bodyParse = JSON.parse(body);

                    resolve(bodyParse);
                } else {
                    reject(error);
                }
            });
        });
    }

    private static getRemoteVersion(): Promise<{appVersion: string, buildVersion: string}> {
        return new Promise((resolve, reject) => {
            request.get({
                url: `${this.website}/version.json?time=${new Date().getTime()}`,
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

        // If the multi account option is active : Request the master password
        if (settings.getSync("option.vip.multi_account.active"))
            Application.requestMasterPassword();
        
        // Else : run the app from splash screen
        else
            Application.runFromSplashScreen();
    }

    public static requestMasterPassword() {

        let promptWindow: Electron.BrowserWindow = PromptPassword.run();

        // Upon master password validated
        // Run the application from splash ccreen
        ipcMain.on('master-password', (event, masterpassword) => {
            if (settings.getSync("option.vip.multi_account.master_password") != Crypt.createHash(masterpassword))
                PromptPassword.displayWrongPassword(promptWindow);
            else {
                Application.runFromSplashScreen(masterpassword);
                promptWindow.close();
            }
        });

        ipcMain.on('master-password-canceled', () => {
            Application.runFromSplashScreen();
            promptWindow.close();
        });
    }

    public static runFromSplashScreen(masterpassword: string = undefined) {

        // create splash screen
        let splash = SplashWindow.run();

        // retrieve remote version
        Promise.all([
            this.getRemoteVersion(),
            this.getVipStatus(),
        ]).then(([version, vip]) => {
            console.log(vip);
            settings.setSync('appVersion', version.appVersion);

            // hide slpash screen
            splash.hide();

            // run update
            UpdateWindow.run().then(() => {

                // If the multi account is active, open multi windows
                if (settings.getSync("option.vip.multi_account.active"))
                    this.addMultiWindows();
                else
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
                    vipStatus: vip.status,
                    vipDate: vip.date,
                    masterpassword: masterpassword,
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
                } else {
                    settings.setSync('language', 'en');
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

    public static addMultiWindows(): void {

        // Retrieve windows from settings
        let windows = settings.getSync("option.vip.multi_account.windows");

        let windowsCount = 0;
        // Event fired when a main.component is initiated
        ipcMain.on('window-ready', (event, arg) => {
            windowsCount += 1; // Increment windows at each event
            if (windowsCount == windows.length) // When all windows have responded
                for (let i in windows)
                    this.gameWindows[i].win.webContents.send('accounts', windows[i]);
        });

        for (let i in windows) {
            this.addWindow();
        }
    }
}
