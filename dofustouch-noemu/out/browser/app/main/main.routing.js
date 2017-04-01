// import {NgModule}            from '@angular/core';
// import {RouterModule}        from '@angular/router';
//
// /* MainComponent */
// import {MainComponent} from './main.component';
//
// @NgModule({
//     imports: [RouterModule.forChild([
//         {path: '', component: MainComponent}
//     ])],
//     exports: [RouterModule]
// })
// export class MainRoutingModule {
// }
"use strict";
const router_1 = require("@angular/router");
const main_component_1 = require("./main.component");
const routes = [
    { path: '', component: main_component_1.MainComponent }
];
exports.MainRoutingModule = router_1.RouterModule.forChild(routes);

//# sourceMappingURL=main.routing.js.map
