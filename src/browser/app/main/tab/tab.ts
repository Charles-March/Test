export class Tab {
  id: number;
  character: string;
  isLogged: boolean;
  isFocus: boolean;
  notification: boolean;
  window: any | Window;
  static seqId: number = 1;

  public constructor(){
      this.id = Tab.seqId++;
      this.character = null;
      this.isLogged = false;
      this.isFocus = false;
      this.window = null;
      this.notification = false;
  }
}
