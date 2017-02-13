import {app, ipcMain} from 'electron';
const settings = require('electron-settings');
const i18n = require('node-translate');

import { ShortCuts } from './shortcuts';
import { Application } from './application';
import { OptionWindow } from './option-window';
import {ChangeLogWindow} from "./changelog-window";

export class GameMenuTemplate {

    static build(): Electron.MenuItemOptions[]{

        const template: Electron.MenuItemOptions[] = [
            {
                label: i18n.t('game-menu.file.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.file.new-window'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_window')),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            Application.addWindow();
                        }
                    },
                    {
                        label: i18n.t('game-menu.file.new-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.new_tab')),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('new-tab', {});
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.file.close-window'),
                        accelerator: 'Shift+CmdOrCtrl+W',
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            //Emulator.openGameWindow();
                            focusedWindow.close();
                        }
                    },
                    {
                        label: i18n.t('game-menu.file.close-tab'),
                        accelerator: 'CmdOrCtrl+W',
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('close-tab', {});
                        }
                    },
                ]
            },
            {
                label: i18n.t('game-menu.edit.title'),
                submenu: [
                    {
                        role: 'undo'
                    },
                    {
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'cut'
                    },
                    {
                        role: 'copy'
                    },
                    {
                        role: 'paste'
                    },
                    {
                        role: 'delete'
                    },
                    {
                        role: 'selectall'
                    }
                ]
            },
            {
                label: i18n.t('game-menu.view.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.view.reload'),
                        accelerator: 'CmdOrCtrl+R',
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            if (focusedWindow) focusedWindow.reload()
                        }
                    },
                    {
                        label: i18n.t('game-menu.view.console'),
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.view.reset-zoom'),
                        role: 'resetzoom'
                    },
                    {
                        label: i18n.t('game-menu.view.zoom-p'),
                        role: 'zoomin'
                    },
                    {
                        label: i18n.t('game-menu.view.zoom-m'),
                        role: 'zoomout'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: i18n.t('game-menu.view.full-screen'),
                        role: 'togglefullscreen'
                    }
                ]
            },
            {
                label: i18n.t('game-menu.window.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.window.prev-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.prev_tab')),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('switch-tab', 'prev');
                        }
                    },
                    {
                        label: i18n.t('game-menu.window.next-tab'),
                        accelerator: ShortCuts.convert(settings.getSync('option.shortcuts.no_emu.next_tab')),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.send('switch-tab', 'next');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        'label': i18n.t('game-menu.window.enable-sound'),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.setAudioMuted(false);
                        }
                    },
                    {
                        'label': i18n.t('game-menu.window.disable-sound'),
                        click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            focusedWindow.webContents.setAudioMuted(true);
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label:i18n.t('game-menu.settings.title'),
                submenu: [
                    {
                        label: i18n.t('game-menu.settings.option'),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            OptionWindow.run();
                        }
                    },
                    {
                        label: i18n.t('game-menu.settings.changelog'),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            ChangeLogWindow.run();
                        }
                    },
                    {
                        label: i18n.t('game-menu.settings.redownload-file-game'),
                        click (item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                            settings.setSync('appVersion', null);
                            settings.setSync('buildVersion', null);
                            app.relaunch();
                            app.exit(0);
                        }
                    },
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: i18n.t('game-menu.help.about'),
                        click () {
                            require('electron').shell.openExternal('')
                        }
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            this.darwin(template);
        }

        return template;
    }

    static darwin(template: any){
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })
        // Edit menu.
        template[2].submenu.push(
            {
                type: 'separator'
            },
            {
                label: 'Speech',
                submenu: [
                    {
                        role: 'startspeaking'
                    },
                    {
                        role: 'stopspeaking'
                    }
                ]
            }
        )
    }
}
