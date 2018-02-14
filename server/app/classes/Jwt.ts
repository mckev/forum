// How to generate public and private key pair:
//    - Ref: https://stackoverflow.com/questions/5244129/use-rsa-private-key-to-generate-public-key
//    $ openssl genrsa -out test-cert.pem 2048
//    $ openssl rsa -in test-cert.pem -pubout > test-cert.pub


import * as jwt from "jsonwebtoken";


export class Jwt {
    public static async Sign(payload: any, privateKey: Buffer, options = {}): Promise<string> {
        options["algorithm"] = "RS256";
        return new Promise<string>((resolve, reject) => {
            jwt.sign(payload, privateKey, options, (err, token) => {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    }

    public static async Verify(token: string, publicKey: Buffer, options = {}): Promise<any> {
        options["algorithms"] = ["RS256"];
        return new Promise<any>((resolve, reject) => {
            jwt.verify(token, publicKey, options, (err, payload) => {
                if (err) {
                    return reject(err);
                }
                return resolve(payload);
            });
        });
    }
}
