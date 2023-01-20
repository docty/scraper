"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const puppeteer_1 = require("puppeteer");
const config_1 = require("./config");
const main = async (option) => {
    const browser = await (0, puppeteer_1.launch)({ headless: false, timeout: 0 });
    const page = await browser.newPage();
    console.log('Browser opened successfully!!!');
    const url = new URL('https://scholar.google.com/scholar');
    url.searchParams.set('start', option.start);
    url.searchParams.set('hl', 'en');
    url.searchParams.set('as_sdt', '0,5');
    url.searchParams.set('q', option.query);
    url.searchParams.set('btnG', '');
    url.searchParams.set('oq', 'r');
    await page.goto(url.href);
    //await imputation(page, option.query)
    const link = await (0, config_1.getLink)(page);
    const container = await (0, config_1.synthesis)(link, browser);
    await browser.close();
    option.onComplete(container);
};
exports.main = main;
