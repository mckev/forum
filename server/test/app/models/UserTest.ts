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
        const user = await User.GetUser(username);
        expect(user).to.equal(null);
    });

    it("adds a user", async () => {
        id = await User.AddUser(username, password, thumbsup_tot, thumbsdown_tot);
    });

    it("verifies that user has been created", async () => {
        const user = await User.GetUser(username);
        delete (user.id);
        delete (user.created);
        expect(user).to.deep.equal({
            "username": username,
            "password": password,
            "thumbsup_tot": thumbsup_tot,
            "thumbsdown_tot": thumbsdown_tot,
        });
    });

    it("updates property of a user", async () => {
        const user = await User.GetUser(username);
        user.thumbsup_tot += 1;
        user.thumbsdown_tot -= 1;
        await User.UpdateUser(user);
    });

    it("verifies that user property has been updated", async () => {
        const user = await User.GetUser(username);
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

});
