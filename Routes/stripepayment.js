var express = require("express");
var router = express.Router();
const { makepayment } = require("../Controller/stripepayment");
const { verifyToken } = require("../Controller/Auth");

router.post("/stripepayment", makepayment);

module.exports = router;
