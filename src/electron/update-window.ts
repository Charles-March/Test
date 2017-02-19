import request = require("request");
const pkg = require('./../../package.json');
const settings = require('electron-settings');
const i18n = require('node-translate');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const decompressUnzip = require('decompress-unzip');

import electron = require("electron");
import {ipcMain, app, Menu, BrowserWindow, dialog, shell} from 'electron';
import * as url from 'url';
import * as fs from 'fs';

import {Application} from './application';
import {spawn} from "child_process";

declare interface UpdateResponse {
    noemu: {
        version: string;
        required: boolean;
        web: boolean;
    };
    dofustouch: {
        version: string;
        file: string;
        fileName: string;
    }
}

export class UpdateWindow {

    public static win: Electron.BrowserWindow;

    private static createWindow(): Electron.BrowserWindow {
        let window = new electron.BrowserWindow({
            width: 800,
            height: 150,
            resizable: false,
            center: true,
            parent: electron.BrowserWindow.getFocusedWindow(),
            darkTheme: true,
            skipTaskbar: true,
            show: true,
            modal: true,
        });

        window.setMenu(null);

        window.on('closed', () => {
            window = null;
        });

        return window;
    }

    private static openUpdateModal(response: UpdateResponse): Promise<any> {
        return new Promise((resolve, reject) => {

            let message = i18n.t('updater.new-update.default');
            let buttons: Array<string> = [i18n.t('updater.new-update.go-site')];

            if (!response.noemu.required) {
                buttons.push(i18n.t('updater.new-update.ignore'));
            } else {
                message = i18n.t('updater.new-update.required')
            }


            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: i18n.t('updater.new-update.title', {version: response.noemu.version}),
                message: message,
                buttons: buttons,
            }, (buttonIndex: number) => {
                if (buttonIndex == 0) {
                    shell.openExternal("http://dofustouch.no-emu.com/#download")
                    app.exit();
                } else {
                    resolve();
                }
            });
        });
    }

    public static checkNoEmuUpdate(response: UpdateResponse): Promise<UpdateResponse> {
        return new Promise((resolve, reject) => {
            console.log(pkg.version);
            if (pkg.version == response.noemu.version) {
                console.log('No-Emu is already up to date');
                resolve(response);
            } else {
                switch (process.platform) {
                    case 'darwin':
                    case 'linux':
                    case 'win32':
                        this.openUpdateModal(response).then(() => {
                            resolve(response);
                        });
                        break;
                    /*case 'win32':
                     if (!fs.existsSync('updater.exe')) {
                     dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                     type: 'info',
                     title: 'Erreur updater.exe manquant',
                     message: 'Attention, il semblerait que votre système ai bloqué l\'updater' +
                     ' de No-Emu. Ajoutez une règle dans votre antivirus pour le fichier updater.exe,' +
                     ' ou téléchargez la dernière version depuis notre site.',
                     buttons: ['Se rendre sur le site', 'Ok'],
                     }, (buttonIndex: number) => {
                     if (buttonIndex == 0) {
                     shell.openExternal("http://dofustouch.no-emu.com/#download")
                     }
                     app.exit();
                     });
                     } else {
                     if(response.noemu.web){
                     this.openUpdateModal(response).then(() => {
                     resolve(response);
                     });
                     }else{
                     spawn('updater.exe', null, {
                     detached: true
                     });
                     app.quit();
                     }
                     }
                     break;*/
                }
            }
        });
    }

    public static checkGameUpdate(response: UpdateResponse): Promise<UpdateResponse> {
        return new Promise((resolve, reject) => {

            if (settings.getSync('buildVersion') == response.dofustouch.version) {
                console.log('Game is already up to date');
                resolve();
            } else {
                this.win = this.createWindow();


                let savePath = app.getPath('userData') + '/' + response.dofustouch.fileName;
                console.log(savePath);

                let remoteUrl = response.dofustouch.file;

                this.win.loadURL(`file://${Application.appPath}/out/browser/index.html#/update/${encodeURIComponent(savePath)}/${encodeURIComponent(remoteUrl)}`);

                if (Application.cmdOptions.devmode) {
                    this.win.webContents.openDevTools();
                }

                ipcMain.on('install-update', (event, arg) => {
                    console.log('ready to update');

                    decompress(savePath, app.getPath('userData') + '/game', {
                        plugins: [
                            decompressTargz(),
                            decompressUnzip()
                        ]
                    }).then(() => {
                        console.log('Files decompressed');
                        settings.setSync('buildVersion', response.dofustouch.version);
                        resolve();
                    }).catch(reject);

                    /*extract(savePath, {dir: app.getPath('userData') + '/game'}, function (err: any) {

                     if (err) {
                     return reject(err);
                     }

                     console.log('extract finish');
                     settings.setSync('buildVersion', response.dofustouch.version);
                     resolve();
                     })*/
                });
            }
        });
    }

    public static run(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.retrieveUpdate().then((response) => {
                return this.checkNoEmuUpdate(response);
            }).then((response) => {
                return this.checkGameUpdate(response);
            }).then(() => {
                resolve();
            }).catch(reject);
        });

    }

    private static retrieveUpdate(): Promise<UpdateResponse> {
        return new Promise((resolve, reject) => {

            let queries = 'version=' + settings.getSync('buildVersion') + '&os=' + process.platform;

            let uri = `${Application.website}/update.php?${queries}`;

            request.get({
                url: uri,
                forever: true,
                gzip: true
            }, (error, response, body) => {
                console.log(body);
                if (!error && response.statusCode == 200) {
                    let parseBody: UpdateResponse = JSON.parse(body);
                    resolve(parseBody);
                } else {

                    if (error) {
                        reject(error);
                    } else {
                        reject(body);
                    }
                }
            });
        });
    }

}
