// let crypto: any;

// try {
//     crypto = (<any>global).nodeRequire('crypto');
// } catch (error) {
//     crypto = require('crypto');
// }
const crypto = (<any>global).nodeRequire('crypto');
const algorithm = 'aes-256-ctr';

export class Crypt {

    // Encrypt "text" with "password"
    public static encrypt(text: string, password: string){
        var cipher = crypto.createCipher(algorithm, password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    // Decrypt "text" with "password"
    public static decrypt(text: string, password: string){
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    // Return the hash of "text"
    public static createHash(text: string) {
        return crypto.createHash('md5').update(text).digest("hex");
    }

}