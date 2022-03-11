export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    valueHeader: string;
    pairName: string;
    curPrice: string;
    openPrice: string;
    type: string;
    dateTime: string;
    referralCode: string;
    side: string;
    pnlChange: string;
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
export interface IRenderContent {
    cardName?: string
    images: string[]
    valueHeader: string
    md: boolean
    type: string
    pairName: string
    curPrice: string
    openPrice: string
    dateTime: string
    referralCode: string
    side: string
    trend: string
    isChangePositive: boolean
    isChangeNegative: boolean
}

export interface IRenderWithPrice {
    images: string[] 
    cardName: string
    pairName: string
    curPrice: string
    openPrice: string
    dateTime: string
    type: string
    referralCode: string
    side: string
    valueHeader: string
    isChangePositive: boolean
    isChangeNegative: boolean
    md: boolean, 
    trend: string
}


export interface IRenderWithCumulative {
    images: string[] 
    cardName: string
    pairName: string
    dateTime: string
    referralCode: string
    valueHeader: string
    isChangePositive: boolean
    isChangeNegative: boolean
    md: boolean, 
    trend: string
}
export interface IRenderWithoutPrice {
    images: string[] 
    cardName: string
    md: boolean
}