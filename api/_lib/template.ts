
import { readFileSync } from 'fs';
import {marked} from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, IRenderContent, IRenderWithPrice, IRenderWithoutPrice } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);
const QRCode = require('qrcode');

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');
let dataUrl = '';
function getCss(theme: string, isChangePositive: boolean) {
    let background = 'linear-gradient(180deg, #05051E 0%, #000D7E 100%)';
    let foreground = 'rgba(255, 255, 255, 0.8)';

    if (theme === 'dark') {
        background = '#262938';
        foreground = '#FFFFFF';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
    }

    body {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 40px;
        background: ${background};
        font-family: 'Inter', sans-serif;
        font-style: normal;
        letter-spacing: -0.01em;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .header {
        display: flex;
        align-items: center;
    }

    .header .details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${foreground};
        overflow: hidden;
    }

    .header .name {
        font-weight: 600;
        font-size: 20px;
        white-space: nowrap;
        overflow: hidden;
        color: ${foreground};
        text-overflow: ellipsis;
    }

    .desc {
        font-size: 12px;
        font-weight: normal;
        margin-top: 10px;
        color: rgba(255, 255, 255, 0.5);
    }

    .tokenLogo {
        margin-right: 12px;
        border-radius: 50%;
    }

    .main {
        padding: 0px;
        margin-top: 45px;
    }

    .main .title {
        font-weight: 500;
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
    }

    .pair-info .info {
        margin-top: 36px;
        margin-bottom: 8px;
    }

    .pair-info .line {
        color:  rgba(255, 255, 255, 0.3);
        margin: 0 6px;
        transform: translateY(-5px);
    }

    .info .pair-name {
        font-weight: bold;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
    }

    .info .pair-side {
        font-size: 16px;
        font-weight: 500;
    }

    .pair-info .time {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
    }


    .main .details .change {
        font-weight: 800;
        font-size: 45px;
        color: ${isChangePositive ? "#21E070" : "#FF1D7C"};
        line-height: 45px;
    }


    .price {
        display: flex;
        margin-top: 14px;
    }

    .price .value{
        min-width: 120px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
    }

    .price .value p {
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 8px;
        font-size: 12px;
    }
    .referral {
        margin-top: 5px;
    }

    .code-img{
        width: 70px;
        height: 70px;
        opacity: 0;
    }

    .code-num p{
        font-size: 12px;
        margin-bottom: 5px;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.5);
    }

    .code-num span{
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        font-size: 24px;
    }

    .change svg {
        height: 44px;
        width: 44px;
        position: relative;
        top: 8px;
        right: -12px;
    }

    .center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header.center {
        justify-content: space-between;
    }

    .font-40px {
        font-size: 40px !important;
    }
    

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }`;
}

export async function getHtml(parsedReq: ParsedRequest) {
    const { cardName, valueHeader, pairName, pnlChange, footerURL, theme, md, images, curPrice, openPrice, side,dateTime, referralCode } = parsedReq;
    console.log(footerURL,'footerURL')

    const isChangePositive = pnlChange?.includes("+") ?? false;
    const isChangeNegative = pnlChange?.includes("-") ?? false;

    dataUrl = await QRCode.toDataURL('http://www.google.com',{
        margin: 1,
        width: 70
    });
    let trend: string;

    if (isChangePositive) {
        trend = pnlChange.split("+")[1]
    } else if (isChangeNegative) {
        trend = pnlChange.split("-")[1]
    } else {
        trend = pnlChange || '';
    }

    return `<!DOCTYPE html>
            <html>
                <meta charset="utf-8">
                <title>Generated Image</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    ${getCss(theme, isChangePositive)}
                </style>
                <body>
                    ${renderContent({cardName, images, valueHeader, md, pairName, curPrice, openPrice, side, dateTime, referralCode,isChangePositive, isChangeNegative, trend})}
                </body>
            </html>`;
    }

function getImage(src: string, height = '80', className = 'logo') {
    return `<img
        class="${sanitizeHtml(className)}"
        src="${sanitizeHtml(src)}"
        width="auto"
        height="${sanitizeHtml(height)}"
        onerror="this.onerror=null; this.remove();"
    />`
}

function renderContent({cardName, images, valueHeader, md, pairName, curPrice, openPrice, dateTime, referralCode, side, isChangePositive, isChangeNegative, trend}: IRenderContent) {
    if (!cardName || cardName === "default") {
        return renderOnlyLogo(images[0])
    } else if (!valueHeader || !pairName) {
        return renderWithoutPrice({images, cardName, md})
    } else {
        return renderWithPrice({images, cardName, pairName, curPrice, openPrice, dateTime, referralCode, side, valueHeader, isChangePositive, isChangeNegative, md, trend})
    }
}


function renderOnlyLogo(image: string) {
    return `<div class="center">
                ${getImage(image, "120", "tokenLogo")}
            </div>`
}

function renderWithoutPrice({images, cardName, md}: IRenderWithoutPrice) {
    return `<div class="header center">
                <div class="details">
                    ${getImage(images[0], '100', "tokenLogo")}
                    <div class="name font-40px">${emojify(
                        md ? marked(cardName) : sanitizeHtml(cardName)
                    )}</div>
                </div>
            </div>`
}

function renderWithPrice({images, cardName, pairName, valueHeader, curPrice, openPrice, side, dateTime, referralCode, isChangePositive, isChangeNegative, md, trend}: IRenderWithPrice) {
    return `<div class="header">
                    ${getImage(images[0], '30', "tokenLogo")}
                    <div class="name">${emojify(
                        md ? marked(cardName) : sanitizeHtml(cardName)
                    )}</div>                  
            </div>
            <div class="desc">Permissionless lending and margin trading protocol</div> 
            <div class="pair-info">
                <div class="info">
                    <span class="pair-name">${sanitizeHtml(pairName)}</span>
                    <span class="line">|</span>
                    <span class="pair-side" style="${side.indexOf('Long')!==-1?'color:#21E070':'color:#FF1D7C'}">${sanitizeHtml(side)}</span>
                </div>        
                <div class="time">${sanitizeHtml(dateTime)}</div>
            </div>
            <div class="main">
                <div class="title">${sanitizeHtml(valueHeader)}</div>
                
                <div class="details">
                    <div class="change">
                        ${isChangePositive?'+':''}
                        ${isChangeNegative?'-':''}
                        ${sanitizeHtml(trend)}
                    </div>
                </div>
            </div>
            <div class="price">
                <div class="value">
                    <p>Open Price</p>    
                    ${sanitizeHtml(openPrice)}
                </div>
                <div class="value">
                    <p>Current Price</p>   
                    ${sanitizeHtml(curPrice)}
                </div>
            </div>
            <div class="referral">
                <div class="code-img"><img src=${dataUrl} /></div>
                <div class="code-num">
                        <p>Refferral Code</p>
                        <span>${referralCode}</span>
                </div>
            </div>`
}