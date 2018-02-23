import { expect } from "chai";
import * as moment from "moment";
import { User } from "../../../app/models/User";


describe("Test User", () => {
    let id;
    const username = "test-user-" + moment.utc().format("YYYYMMDDhhmmss");
    const password = "***";
    const thumbsup_tot = 10;
    const thumbsdown_tot = 1;

    it("verifies that the user does not exist", async () => {
        const user = await User.GetUserByUsername(username);
        expect(user).to.equal(null);
    });

    it("adds a user", async () => {
        id = await User.AddUser(username, password, thumbsup_tot, thumbsdown_tot);
    });

    it("verifies that user has been created", async () => {
        const user = await User.GetUserByUsername(username);
        delete (user.id);
        delete (user.created);
        expect(user).to.deep.equal({
            "username": username,
            "password": password,
            "thumbsup_tot": thumbsup_tot,
            "thumbsdown_tot": thumbsdown_tot,
        });
    });

    it("updates user properties", async () => {
        const user = await User.GetUserByUsername(username);
        user.thumbsup_tot += 1;
        user.thumbsdown_tot -= 1;
        await User.UpdateUser(id, user);
    });

    it("verifies that user properties have been updated", async () => {
        const user = await User.GetUserByUsername(username);
        delete (user.id);
        delete (user.created);
        expect(user).to.deep.equal({
            "username": username,
            "password": password,
            "thumbsup_tot": thumbsup_tot + 1,
            "thumbsdown_tot": thumbsdown_tot - 1,
        });
    });

    it("deletes the user", async () => {
        await User.DeleteUser(id);
    });

    it("verifies that the user has been deleted", async () => {
        const user = await User.GetUserByUsername(username);
        expect(user).to.equal(null);
    });

});
