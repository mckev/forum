import * as express from "express";
import { Response } from "../app/classes/Response";


const router = express.Router();


router.get("/", function (req, res) {
  Response.SendHtmlResponse(res, 200, "Welcome!");
});


export = router;
