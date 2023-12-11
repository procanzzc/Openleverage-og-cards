const entityMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

export function reverseSanitizeHtml(html: string) {
    return Object.keys(entityMap).reduce((acc, key) => {
        const entity = entityMap[key];
        return acc.replace(new RegExp(entity, 'g'), key);
    }, html);
}

export function sanitizeHtml(html: string) {
    return String(html).replace(/[&<>"'\/]/g, key => entityMap[key]);
}

