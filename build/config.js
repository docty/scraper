"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesis = exports.getLink = void 0;
// export const imputation = async (page: Page, query: string) => {
//     const textBoxSelector = '#gs_hdr_tsi';
//     const buttonSelector = '#gs_hdr_tsb';
//     const displaySelector = '#gs_res_ccl';
//     await sleep(10000);
//     await page.type(textBoxSelector, query, { delay: 200 });
//     await sleep(10000);
//     await page.click(buttonSelector);
//     await page.waitForSelector(displaySelector);
//     console.log('Fetching data')
// }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getLink = async (page) => {
    const resultSelector = '#gs_res_ccl_mid > div';
    const nextSelector = ' #gs_n > center > table > tbody > tr > td:nth-child(12) > a';
    const link = await page.evaluate(selector => {
        const holder = [];
        document.querySelectorAll(selector).forEach(anchor => {
            const value = anchor.querySelector('.gs_ri > h3 > a');
            if (value) {
                holder.push(value.href);
            }
        });
        return holder;
    }, resultSelector);
    return link;
    // const next = await page.evaluate(selector => {
    //     let holder: string = '';
    //      const value = document.querySelector(selector) as HTMLLinkElement;
    //         if (value) {
    //             holder = value.href
    //         }
    //     return holder;
    // }, nextSelector);
    // console.log(next);
};
exports.getLink = getLink;
const synthesis = async (link, browser) => {
    const holder = [];
    let start = 1;
    for (const item of link) {
        const page = await browser.newPage();
        console.log((start / link.length) * 100);
        await sleep(5000);
        let response = null;
        try {
            response = await page.goto(item, { timeout: 90000, waitUntil: 'load' });
        }
        catch (error) {
            console.log('Error from Synthesis function');
        }
        if (response === null || response === void 0 ? void 0 : response.ok) {
            const contentType = response === null || response === void 0 ? void 0 : response.headers()['content-type'];
            const boundary = contentType === null || contentType === void 0 ? void 0 : contentType.split(';')[0];
            if (boundary === 'application/pdf') {
                console.log('I cannot process pdf files. All pdf files will be automatically downloaded');
            }
            else {
                const newUrl = new URL(response === null || response === void 0 ? void 0 : response.url());
                const output = await processPage(newUrl, page);
                holder.push(output);
            }
        }
        start = start + 1;
        await page.close();
    }
    return holder;
};
exports.synthesis = synthesis;
const processPage = async (url, page) => {
    const journal = journalSelector[url.origin];
    try {
        const title = await page.$eval(journal.title, (item) => (item.textContent));
        await page.screenshot({ path: `LL_.png` });
        const abstract = await page.$$eval(journal.abstract, (item) => (item.map(v => v.textContent)));
        const output = {
            abstract: abstract.join(' '),
            title: title,
            url: url.href
        };
        return output;
    }
    catch (error) {
        return {
            url: url.href
        };
    }
};
const journalSelector = {
    'https://www.sciencedirect.com': {
        title: '#screen-reader-main-title > span',
        abstract: '.abstract.author > div > p'
    },
    'https://link.springer.com': {
        title: '.c-article-title',
        abstract: '.c-article-section__content  > p'
    },
    'https://www.tandfonline.com': {
        title: '.literatumPublicationTitle > div > div > h1 > span',
        abstract: '#mainTabPanel > article > div.hlFld-Abstract > div.abstractSection.abstractInFull > p'
    },
    'https://onlinelibrary.wiley.com': {
        title: '#article__content > div.article-citation > div > h1',
        abstract: '#section-1-en > div'
    },
    'https://epubs.siam.org': {
        title: '.citation__title',
        abstract: '.abstractSection '
    },
    ' https://ieeexplore.ieee.org': {
        title: '.document-title',
        abstract: '.abstract-text > div > div > div'
    },
    'https://www.osti.gov': {
        title: '.biblio-title',
        abstract: '.search-result-description'
    },
    'https://pubsonline.informs.org': {
        title: '.citation__title',
        abstract: '.abstractSection.abstractInFull > p'
    },
    'https://aip.scitation.org': {
        title: '.title',
        abstract: '.NLM_paragraph'
    },
    'https://ieeexplore.ieee.org': {
        title: '.document-title',
        abstract: '.abstract-text.row > div > div > div'
    },
    'https://www.ncbi.nlm.nih.gov/': {
        title: '.content-title',
        abstract: '#abstract-1 > div:nth-child(3) > p'
    },
    'https://agupubs.onlinelibrary.wiley.com': {
        title: '.citation__title',
        abstract: '.article-section__content > p'
    },
    'https://www.worldscientific.com/': {
        title: '.publicationContentTitle > h1',
        abstract: '.abstractSection > p'
    },
    'https://openreview.net': {
        title: '.note_content_title > span',
        abstract: '.note_content_value'
    },
    'https://dl.acm.org': {
        title: '.citation__title',
        abstract: '.abstractSection > p'
    },
    'https://academic.oup.com': {
        title: '.title-wrap > .article-title-main',
        abstract: '.abstract > p'
    },
    'https://pubs.acs.org': {
        title: '.article_header-title > span',
        abstract: '.article_abstract-content > p'
    },
    'https://arxiv.org/': {
        title: '.title > span',
        abstract: '.abstract'
    },
    'https://hal.science/': {
        title: '.title-lang',
        abstract: '.abstract-content'
    }
};
