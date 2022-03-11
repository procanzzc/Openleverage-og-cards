import core from 'puppeteer-core';
import { getOptions } from './options';
import { FileType } from './types';
let _page: core.Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(html: string, type: FileType, isDev: boolean, parsedReq: any) {
    const page = await getPage(isDev);
    let width = 400;
    let height = 480;
    if(parsedReq.type == 'default'){
        width = 600;
        height = 300;
    }
    await page.setViewport({ width, height });
    await page.setContent(html);
    const file = await page.screenshot({ type });
    return file;
}
