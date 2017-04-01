import { Injectable } from '@angular/core';

const neutrino= (<any>global).nodeRequire('neutrino-metrics');

type Event = "TIPEEE" | "OK";

@Injectable()
export class NeutrinoService {

    constructor(){
        try {
            neutrino.init("SyxamT87ux");
        } catch(e){
            //console.log(e);
        }
    }

    emit(event:Event):void{
        neutrino.event(event);
    }

}