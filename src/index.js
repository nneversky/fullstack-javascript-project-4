import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pageLoader = (url, options) => {
    const objUrl = new URL(url)
    const nameHtml = `/${objUrl.host.replaceAll('.','-')}${objUrl.pathname.replaceAll('/','-')}.html`
    const filePath = (options.output || path.join(__dirname, '..', '/user/current-dir')) + nameHtml
    return filePath
}