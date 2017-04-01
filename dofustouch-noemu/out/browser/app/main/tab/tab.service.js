"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
let TabService = class TabService {
    constructor() {
        this.tabs = [];
    }
    getTabs() {
        return this.tabs;
    }
    getTab(id) {
        return this.tabs.filter((tab) => {
            return tab.id === id;
        })[0];
    }
    addTab(tab) {
        this.tabs.push(tab);
    }
    getNearTab(nearTab) {
        let tabs = this.tabs.filter((tab) => {
            return tab.id > nearTab.id;
        });
        if (tabs) {
            return tabs[0];
        }
        tabs = this.tabs.filter((tab) => {
            return tab.id < nearTab.id;
        });
        if (tabs) {
            return tabs[(tabs.length - 1)];
        }
        return null;
    }
    removeTab(tab) {
        console.log('remove tab');
        let index = this.tabs.indexOf(tab);
        if (index !== -1) {
            console.log('remove');
            this.tabs.splice(index, 1);
        }
    }
};
TabService = __decorate([
    core_1.Injectable()
], TabService);
exports.TabService = TabService;

//# sourceMappingURL=tab.service.js.map
