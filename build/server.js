"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const path_1 = require("path");
const app = (0, express_1.default)();
const port = 3000;
app.get('/power', (req, res) => {
    (0, _1.main)({
        query: req.query.q,
        start: req.query.start,
        onComplete: function (data) {
            res.send(data);
        }
    });
});
app.get('/', (req, res) => {
    res.sendFile((0, path_1.resolve)('./index.html'));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
