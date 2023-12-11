import { ParsedRequest, Theme, FileType } from '../api/_lib/types';
const { H, R, copee } = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({ src, onclick, onload, onerror, loading }: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('a',
        { className: 'image-wrapper', href: src, onclick },
        H('img',
            { src, onload, onerror, style, title }
        )
    );
}

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        { className: wrapper },
        H('select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map(o =>
                H('option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div',
            { className: arrow },
            '▼'
        )
    );
}

interface TextInputProps {
    value: string;
    oninput: (val: string) => void;
}

const TextInput = ({ value, oninput }: TextInputProps) => {
    return H('div',
        { className: 'input-outer-wrapper' },
        H('div',
            { className: 'input-inner-wrapper' },
            H('input',
                { type: 'text', value, oninput: (e: any) => oninput(e.target.value) }
            )
        )
    );
}

interface ButtonProps {
    label: string;
    onclick: () => void;
}

const Button = ({ label, onclick }: ButtonProps) => {
    return H('button', { onclick }, label);
}

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({ label, input }: FieldProps) => {
    return H('div',
        { className: 'field' },
        H('label',
            H('div', { className: 'field-label' }, label),
            H('div', { className: 'field-value' }, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = { transform: show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
    return H('div',
        { className: 'toast-area' },
        H('div',
            { className: 'toast-outer', style },
            H('div',
                { className: 'toast-inner' },
                H('div',
                    { className: 'toast-message' },
                    message
                )
            )
        ),
    );
}

const themeOptions: DropdownOption[] = [
    { text: 'Light', value: 'light' },
    { text: 'Dark', value: 'dark' },
];

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

const imageLightOptions: DropdownOption[] = [
    { text: 'OLE', value: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-M_8jUJwrWEVdQqoVt_f%2Fuploads%2FnWqpM6OIeOg3vCTddvGH%2Fcard-logo.png?alt=media&token=fdc0603b-f45a-445c-aaee-cb3b42a423bb' },
];

const imageDarkOptions: DropdownOption[] = [
    { text: 'OLE', value: 'https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-M_8jUJwrWEVdQqoVt_f%2Fuploads%2FnWqpM6OIeOg3vCTddvGH%2Fcard-logo.png?alt=media&token=fdc0603b-f45a-445c-aaee-cb3b42a423bb' },
];

const protocolImage = "https://files.gitbook.com/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-M_8jUJwrWEVdQqoVt_f%2Fuploads%2FnWqpM6OIeOg3vCTddvGH%2Fcard-logo.png?alt=media&token=fdc0603b-f45a-445c-aaee-cb3b42a423bb"


interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    selectedImageIndex: number;
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'png',
        theme = 'light',
        md = false,
        valueHeader = 'Pnl',
        type = 'pending',
        pairName = 'BNB - BUSD',
        curPrice = '888 BUSD',
        openPrice = '333 BUSD',
        side = 'Long 2X',
        pnlChange = "-2%",
        dateTime = 'Mar 15, 22 20:00',
        referralCode = 'Um13231',
        footerURL = "https://openleverage.finance",
        images = [protocolImage],
        showToast = false,
        messageToast = '',
        loading = true,
        selectedImageIndex = 0,
        overrideUrl = null,
    } = state;

    const mdValue = md ? '1' : '0';
    const imageOptions = theme === 'light' ? imageLightOptions : imageDarkOptions;
    const url = new URL(window.location.origin);
    url.pathname = `default.${fileType}`;
    theme && url.searchParams.append('theme', theme);
    mdValue && url.searchParams.append('md', mdValue);
    valueHeader && url.searchParams.append('valueHeader', valueHeader);
    type && url.searchParams.append('type', type);
    pairName && url.searchParams.append('pairName', pairName);
    curPrice && url.searchParams.append('curPrice', curPrice);
    openPrice && url.searchParams.append('openPrice', openPrice);
    dateTime && url.searchParams.append('dateTime', dateTime);
    referralCode && url.searchParams.append('referralCode', referralCode);
    side && url.searchParams.append('side', side);
    pnlChange && url.searchParams.append('pnlChange', pnlChange);
    footerURL && url.searchParams.append("footerURL", encodeURIComponent(footerURL));

    for (let image of images) {
        url.searchParams.append('images', image);
    }


    const showAddImageBtn = images.length === 1 ? (H(Field, {
        label: `Image`,
        input: H(Button, {
            label: `Add Image`,
            onclick: () => {
                const nextImage = 'https://openleverage.finance/token-icons/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png'
                setLoadingState({ images: [...images, nextImage] })
            }
        }),
    })) : H('div');

    return H('div',
        { className: 'split' },
        H('div',
            { className: 'pull-left' },
            H('div',
                H(Field, {
                    label: 'Theme',
                    input: H(Dropdown, {
                        options: themeOptions,
                        value: theme,
                        onchange: (val: Theme) => {
                            const options = val === 'light' ? imageLightOptions : imageDarkOptions
                            let clone = [...images];
                            clone[0] = options[selectedImageIndex].value;
                            setLoadingState({ theme: val, images: clone });
                        }
                    })
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({ fileType: val })
                    })
                }),
                H(Field, {
                    label: 'Logo',
                    input: H('div',
                        H(Dropdown, {
                            options: imageOptions,
                            value: imageOptions[selectedImageIndex].value,
                            onchange: (val: string) => {
                                let clone = [...images];
                                clone[0] = val;
                                const selected = imageOptions.map(o => o.value).indexOf(val);
                                setLoadingState({ images: clone, selectedImageIndex: selected });
                            }
                        }),
                    ),
                }),
                H(Field, {
                    label: 'Text Type',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) => setLoadingState({ md: val === '1' })
                    })
                }),
                H(Field, {
                    label: 'Value Header',
                    input: H(TextInput, {
                        value: valueHeader,
                        oninput: (val: string) => {
                            setLoadingState({ valueHeader: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Type',
                    input: H(TextInput, {
                        value: type,
                        oninput: (val: string) => {
                            setLoadingState({ type: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Pair Name',
                    input: H(TextInput, {
                        value: pairName,
                        oninput: (val: string) => {
                            setLoadingState({ pairName: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Current Price',
                    input: H(TextInput, {
                        value: curPrice,
                        oninput: (val: string) => {
                            setLoadingState({ curPrice: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Open Price',
                    input: H(TextInput, {
                        value: openPrice,
                        oninput: (val: string) => {
                            setLoadingState({ openPrice: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'side',
                    input: H(TextInput, {
                        value: side,
                        oninput: (val: string) => {
                            setLoadingState({ side: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'time',
                    input: H(TextInput, {
                        value: dateTime,
                        oninput: (val: string) => {
                            setLoadingState({ dateTime: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Referral code',
                    input: H(TextInput, {
                        value: referralCode,
                        oninput: (val: string) => {
                            setLoadingState({ referralCode: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Percent Change',
                    input: H(TextInput, {
                        value: pnlChange,
                        oninput: (val: string) => {
                            setLoadingState({ pnlChange: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Footer URL',
                    input: H(TextInput, {
                        value: footerURL,
                        oninput: (val: string) => {
                            console.log('onurlinput ' + val);
                            setLoadingState({ footerURL: val, overrideUrl: url });
                        }
                    })
                }),
                ...images.slice(1).map((image, i) => H(Field, {
                    label: `Image`,
                    input: H('div',
                        H(TextInput, {
                            value: image,
                            oninput: (val: string) => {
                                let clone = [...images];
                                clone[i + 1] = val;
                                setLoadingState({ images: clone, overrideUrl: url });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(Button, {
                                label: `Remove Image`,
                                onclick: (e: MouseEvent) => {
                                    e.preventDefault();
                                    const filter = (arr: any[]) => [...arr].filter((_, n) => n !== i + 1);
                                    const imagesClone = filter(images);
                                    setLoadingState({ images: imagesClone });
                                }
                            })
                        )
                    )
                })),
                showAddImageBtn
            )
        ),
        H('div',
            { className: 'pull-right' },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({ showToast: true, messageToast: 'Oops, an error occurred' });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    const success = copee.toClipboard(url.href);
                    if (success) {
                        setState({ showToast: true, messageToast: 'Copied image URL to clipboard' });
                        setTimeout(() => setState({ showToast: false }), 3000);
                    } else {
                        window.open(url.href, '_blank');
                    }
                    return false;
                }
            })
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
