import puppeteer, { ProtocolError } from 'puppeteer';

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    console.log('New page is successfully opened');

    try {
        await page.goto('http://localhost:3000')
    } catch (error) {
        if (error instanceof ProtocolError) {
            console.log(error.message);
        }else{
            console.log(error);
        }
    }


 

    // const result = await page.$x('//*[@id="today"]')

    // console.log(await result[0].evaluate(it => it.textContent));

    // await page.authenticate({password: 'hello', username: 'docty'})

    // console.log(result[0].asElement())


   // await browser.close();
})()