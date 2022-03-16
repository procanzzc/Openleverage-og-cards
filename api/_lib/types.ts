export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
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
    rewardRate: string;
}
export interface IRenderContent {
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
    isChangeNegative: boolean,
    rewardRate: string
}

export interface IRenderWithPrice {
    images: string[] 
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
    pairName: string
    dateTime: string
    referralCode: string
    valueHeader: string
    isChangePositive: boolean
    isChangeNegative: boolean
    md: boolean, 
    trend: string
}

export interface IRenderWithInterest {
    images: string[] 
    pairName: string
    dateTime: string
    referralCode: string
    valueHeader: string
    isChangePositive: boolean
    isChangeNegative: boolean
    md: boolean, 
    trend: string,
    rewardRate: string,
}


export interface IRenderWithoutPrice {
    images: string[] 
    md: boolean
}