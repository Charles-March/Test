export class Tab {
  id: number;
  character: string;
  isLogged: boolean;
  isFocus: boolean;
  notification: boolean;
  window: any | Window;
  static seqId: number = 1;
  credentials: {account_name: string, password: string};

  public constructor(credentials?: {account_name: string, password: string}){
      this.id = Tab.seqId++;
      this.character = null;
      this.isLogged = false;
      this.isFocus = false;
      this.window = null;
      this.notification = false;

      if (credentials)
        this.credentials = credentials;
  }
}
