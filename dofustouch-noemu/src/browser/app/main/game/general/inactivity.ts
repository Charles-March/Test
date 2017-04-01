
import Timer = NodeJS.Timer;

export class Inactivity {

    private idInt: Timer;
    private window: any | Window;

    constructor(window:any|Window, enable:boolean){

        this.window = window;

        if(enable){
            this.idInt = setInterval(()=>{
                this.window.d.recordActivity();
            }, 60 * 60 * 3);
        }
    }

    public reset(){
        clearInterval(this.idInt);
    }
}