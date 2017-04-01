"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const core_1 = require("@angular/core");
const tab_service_1 = require("./tab/tab.service");
const tab_1 = require("./tab/tab");
const shortcuts_1 = require("./../shortcuts/shortcuts");
const ipcrenderer_service_1 = require("./../../shared/electron/ipcrenderer.service");
const application_service_1 = require("../../shared/electron/application.service");
const settings_service_1 = require("../../shared/settings/settings.service");
const platform_browser_1 = require("@angular/platform-browser");
//const { ipcRenderer } = (<any>global).nodeRequire('electron');
let MainComponent = class MainComponent {
    constructor(window, tabService, ipcRendererService, settingsService, applicationService, titleService) {
        this.window = window;
        this.tabService = tabService;
        this.ipcRendererService = ipcRendererService;
        this.settingsService = settingsService;
        this.applicationService = applicationService;
        this.titleService = titleService;
        this.activTab = null;
        this.window.appVersion = this.applicationService.appVersion;
        this.window.buildVersion = this.applicationService.buildVersion;
        this.shortCuts = new shortcuts_1.ShortCuts(this.window);
        this.titleService.setTitle('DofusTouch No-Emu');
    }
    addTab() {
        let tab = new tab_1.Tab();
        this.tabService.addTab(tab);
        this.selectTab(tab);
    }
    removeTab(tab) {
        if (this.activTab !== null && tab.id === this.activTab.id) {
            console.log('activTab was deleted');
            this.activTab = null;
        }
        this.tabService.removeTab(tab);
    }
    setEventListener() {
        // ipc new tab
        this.ipcRendererService.on('new-tab', (event) => {
            this.addTab();
        });
        // ipc close tab
        this.ipcRendererService.on('close-tab', (event) => {
            this.removeTab(this.activTab);
        });
        // ipc switch tab
        this.ipcRendererService.on('switch-tab', (event, action) => {
            if (Number.isInteger(action)) {
                if (typeof this.tabs[action] !== 'undefined') {
                    this.selectTab(this.tabs[action]);
                }
            }
            else {
                let index = this.tabs.indexOf(this.activTab);
                switch (action) {
                    case 'prev':
                        if (index !== -1) {
                            if (index === 0) {
                                this.selectTab(this.tabs[this.tabs.length - 1]);
                            }
                            else {
                                this.selectTab(this.tabs[index - 1]);
                            }
                        }
                        break;
                    case 'next':
                        if (index !== -1) {
                            if (index === (this.tabs.length - 1)) {
                                this.selectTab(this.tabs[0]);
                            }
                            else {
                                this.selectTab(this.tabs[index + 1]);
                            }
                        }
                        break;
                }
            }
        });
    }
    selectTab(tab) {
        // remove old activTab
        if (this.activTab !== null) {
            this.activTab.isFocus = false;
        }
        // set the new one
        this.activTab = tab;
        // add focus and remove noitification
        this.activTab.isFocus = true;
        this.activTab.notification = false;
        //focus the iframe
        if (this.activTab.isLogged) {
            this.activTab.window.focus();
        }
        // change the name of the windows
        if (this.activTab.isLogged) {
            this.titleService.setTitle(this.activTab.character);
        }
    }
    ngOnInit() {
        this.tabs = this.tabService.getTabs();
        this.setEventListener();
        this.addTab();
    }
};
MainComponent = __decorate([
    core_1.Component({
        selector: 'main',
        templateUrl: 'app/main/main.component.html',
        styleUrls: ['app/main/main.component.css'],
        host: {
            "style": "height:100%; overflow: hidden; background: black;" // find something less ugly in future
        }
    }),
    __param(0, core_1.Inject('Window')),
    __metadata("design:paramtypes", [Window,
        tab_service_1.TabService,
        ipcrenderer_service_1.IpcRendererService,
        settings_service_1.SettingsService,
        application_service_1.ApplicationService,
        platform_browser_1.Title])
], MainComponent);
exports.MainComponent = MainComponent;

//# sourceMappingURL=main.component.js.map
