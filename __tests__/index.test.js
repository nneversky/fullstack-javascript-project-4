import nock from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';
import fsp from 'fs/promises';
import os from 'os';
import downloadPage from '../src/utils.js';
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const tempFilePath = (name) => path.join(os.tmpdir(), name);
const getFixturePath = (name) => path.join(path.dirname(__filename), '..', '__fixtures__', name);

let htmlDataFixture;
let imgDataFixture;
let cssDataFixture;
let jsDataFixture;

nock.disableNetConnect();

afterAll(async () => {
  await fsp.rm(tempFilePath('tmpDir'), { recursive: true, force: true });
});

beforeAll(async () => {
  htmlDataFixture = await fsp.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  imgDataFixture = await fsp.readFile(getFixturePath('ru-hexlet-io-courses_files\\ru-hexlet-io-assets.png'), 'utf-8');
  cssDataFixture = await fsp.readFile(getFixturePath('ru-hexlet-io-courses_files\\ru-hexlet-io-assets-application.css'), 'utf-8');
  jsDataFixture = await fsp.readFile(getFixturePath('ru-hexlet-io-courses_files\\ru-hexlet-io-recaptcha.js'), 'utf-8');
});

describe('Successful download', () => {
  test('Download page', async () => {
    nock('https://ru.hexlet.io')
      .get(/\/courses/)
      .reply(200, htmlDataFixture)
      .get(/application*\.css/)
      .reply(200, cssDataFixture)
      .get(/apple-touch-icon_ru*\.png/)
      .reply(200, imgDataFixture)
      .get(/recaptcha*\.js/)
      .reply(200, jsDataFixture);
    await downloadPage('https://ru.hexlet.io/courses', tempFilePath('tmpDir\\ru-hexlet-io-courses.html'));
    const htmlDataResurse = await fsp.readFile(tempFilePath('tmpDir\\ru-hexlet-io-courses.html'), 'utf-8');
    const cssDataResurse = await fsp.readFile(tempFilePath('tmpDir\\ru-hexlet-io-courses_files\\application-85a5e47ccf06545c3405a34d58d5bcf570539d5b28f5de0723cd1f2a4af46eae.css'), 'utf-8');
    const imgDataResurse = await fsp.readFile(tempFilePath('tmpDir\\ru-hexlet-io-courses_files\\apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png'), 'utf-8');
    const jsDataResurse = await fsp.readFile(tempFilePath('tmpDir\\ru-hexlet-io-courses_files\\recaptcha_v3-0c1ca770d8b06a77200cdd614e59fe6db45ccbc15436a6e286bd503a3273164f.js'), 'utf-8');
    expect(jsDataFixture).toEqual(jsDataResurse);
    expect(imgDataFixture).toEqual(imgDataResurse);
    expect(cssDataFixture).toEqual(cssDataResurse);
    expect(htmlDataFixture).toEqual(htmlDataResurse);
  });
});
