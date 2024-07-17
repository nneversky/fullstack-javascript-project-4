import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import saveContent from '../src/saveContent.js';
import debug from 'debug';

const log = debug('page-loader');

export default async (url, filePath) => {
  const pathOnFiles = filePath.replace('.html', '_files');

  try {
    const response = await axios.get(url);
    log('Received html file');

    try {
      await fsp.access(filePath);
    } catch (error) {
      const dir = path.dirname(filePath);
      await fsp.mkdir(dir, { recursive: true });
      log(`Created directory: ${dir}`);
    }

    await fsp.writeFile(filePath, response.data);
    saveContent(pathOnFiles, filePath, url);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
