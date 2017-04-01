import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule}             from './app.module';
import {enableProdMode} from '@angular/core';
const {Application} = (<any>global).nodeRequire('electron').remote.require('./application');

if(Application.cmdOptions.devmode){
    console.info('- No-Emu is in dev mode');
}else{
    console.info('- No-Emu is in prod mode');
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);