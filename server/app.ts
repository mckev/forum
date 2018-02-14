// Notes:
//    - tslint.json was taken from: https://github.com/Microsoft/vscode-tslint/blob/master/tslint-tests/tslint.json


import * as express from "express";


async function main() {
    const app = express();


    // Routing
    app.use("/", require("./routes"));


    // Listen
    const port = process.env.PORT || 8080;
    app.listen(port, function () {
        console.log("Express server is listening on port " + port);
    });
}


main();
