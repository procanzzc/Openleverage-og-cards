import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { footerURL, images, theme, md, valueHeader,type, pairName, pnlChange, curPrice, openPrice,side, dateTime, referralCode,rewardRate } = (query || {});

    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    
    let extension = '';
    let url = getString(footerURL);
    console.log(pathname)
   
    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        valueHeader: getString(valueHeader),
        type: getString(type),
        pairName: getString(pairName),
        curPrice: getString(curPrice),
        openPrice: getString(openPrice),
        side: getString(side),
        pnlChange: getString(pnlChange),
        dateTime: getString(dateTime),
        referralCode: getString(referralCode),
        footerURL: decodeURIComponent(url),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        images: getArray(images),
        rewardRate: getString(rewardRate)
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getString(stringOrArray: string[] | string | undefined) {
    if (stringOrArray && Array.isArray(stringOrArray)) {
        if (stringOrArray.length === 0) {
            return ''
        } else {
            return stringOrArray[0]
        }
    } else {
        return stringOrArray ?? ''
    }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    const defaultImage = theme === 'light'
        ? "https://eth.openleverage.finance/static/media/OLE.da76c3c2.svg"
        : "https://eth.openleverage.finance/static/media/OLE.da76c3c2.svg";

    if (!images || !images[0]) {
        return [defaultImage];
    }

    return images;
}

