import path from 'path';
import debug from 'debug';

const log = debug('page-loader');

const processName = (name, replacer = '-') =>
  name
    .match(/\w+/g)
    ?.filter((x) => x)
    .join(replacer) || '';

export const urlToFilename = (link, defaultFormat = '.html') => {
  const { dir, name, ext } = path.parse(link);
  const slug = processName(path.join(dir, name));
  const format = ext || defaultFormat;
  return `${slug}${format}`;
};

export const urlToDirname = (link, postfix = '_files') => {
  const { dir, name } = path.parse(link);
  const slug = processName(path.join(dir, name));
  return `${slug}${postfix}`;
};
