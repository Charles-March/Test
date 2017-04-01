"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
/* Shared Module */
const shared_module_1 = require("./../../shared/shared.module");
const main_routing_1 = require("./main.routing");
/* MainComponent */
const main_component_1 = require("./main.component");
const game_component_1 = require("./game/game.component");
const tab_service_1 = require("./tab/tab.service");
let MainModule = class MainModule {
};
MainModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            shared_module_1.SharedModule,
            main_routing_1.MainRoutingModule,
        ],
        providers: [
            tab_service_1.TabService,
            { provide: 'Window', useValue: window },
        ],
        declarations: [
            main_component_1.MainComponent,
            game_component_1.GameComponent,
            game_component_1.SafePipe
        ]
    })
], MainModule);
exports.MainModule = MainModule;

//# sourceMappingURL=main.module.js.map
