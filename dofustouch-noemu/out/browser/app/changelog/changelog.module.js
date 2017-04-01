"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const shared_module_1 = require("./../../shared/shared.module");
const changelog_routing_module_1 = require("./changelog-routing.module");
const changelog_component_1 = require("./changelog.component");
let ChangeLogModule = class ChangeLogModule {
};
ChangeLogModule = __decorate([
    core_1.NgModule({
        declarations: [changelog_component_1.ChangeLogComponent],
        imports: [
            shared_module_1.SharedModule,
            changelog_routing_module_1.ChangeLogRoutingModule,
            ng_bootstrap_1.NgbModule.forRoot()
        ],
    })
], ChangeLogModule);
exports.ChangeLogModule = ChangeLogModule;

//# sourceMappingURL=changelog.module.js.map
