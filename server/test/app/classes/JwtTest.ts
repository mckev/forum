import { expect } from "chai";
import * as fs from "fs";
import { Jwt } from "../../../app/classes/Jwt";
import { Utils } from "../../../app/classes/Utils";


describe("Test Jwt", () => {
    const privateKey = fs.readFileSync("./keys/test-cert.pem");
    const publicKey = fs.readFileSync("./keys/test-cert.pub");
    const invalidPrivateKey = fs.readFileSync("./keys/prod-cert.pem");
    const payload = {
        "foo": "bar",
        "id": 7,
    };

    it("can create a JWT token", async () => {
        const token = await Jwt.Sign(payload, privateKey);
        const numberOfDots = token.replace(/[^\.]/g, "").length;
        expect(numberOfDots).to.equal(2);
    });

    it("can verify a JWT token", async () => {
        const token = await Jwt.Sign(payload, privateKey);
        const decoded = await Jwt.Verify(token, publicKey);
        delete decoded["iat"];
        expect(decoded).to.deep.equal(payload);
    });

    it("throws an error when JWT token is expired", async () => {
        const token = await Jwt.Sign(payload, privateKey, { "expiresIn": "0s" });
        await Utils.Delay(10);
        try {
            await Jwt.Verify(token, publicKey);
            expect.fail();
        } catch (err) {
            expect(err.name).to.equal("TokenExpiredError");
            expect(err.message).to.equal("jwt expired");
        }
    });

    it("throws an error when header part of JWT token was tampered", async () => {
        const token = await Jwt.Sign(payload, privateKey);
        let newTokens = token.split(".");
        newTokens[0] = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0K";          // echo '{"alg":"none","typ":"JWT"}' | base64
        const newToken = newTokens.join(".");
        try {
            await Jwt.Verify(newToken, publicKey);
            expect.fail();
        } catch (err) {
            expect(err.name).to.equal("JsonWebTokenError");
            expect(err.message).to.equal("invalid algorithm");
        }
    });

    it("throws an error when payload part of JWT token was tampered", async () => {
        const token = await Jwt.Sign(payload, privateKey);
        let newTokens = token.split(".");
        newTokens[1] = "eyJmb28iOiJ4eHgifQo=";                          // echo '{"foo":"xxx"}' | base64
        const newToken = newTokens.join(".");
        try {
            await Jwt.Verify(newToken, publicKey);
            expect.fail();
        } catch (err) {
            expect(err.name).to.equal("JsonWebTokenError");
            expect(err.message).to.equal("invalid token");
        }
    });

    it("throws an error when JWT token was signed by unknown certificate", async () => {
        const token = await Jwt.Sign(payload, invalidPrivateKey);
        try {
            await Jwt.Verify(token, publicKey);
            expect.fail();
        } catch (err) {
            expect(err.name).to.equal("JsonWebTokenError");
            expect(err.message).to.equal("invalid signature");
        }
    });

});
