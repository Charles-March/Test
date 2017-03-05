let crypto: any;

try {
    crypto = (<any>global).nodeRequire('crypto');
} catch (error) {
    crypto = require('crypto');
}
const algorithm = 'aes-256-ctr';

export class Crypt {

    public static encrypt(text: string, password: string){
        var cipher = crypto.createCipher(algorithm, password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    public static decrypt(text: string, password: string){
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    public static createHash(text: string) {
        return crypto.createHash('md5').update(text).digest("hex");
    }

}