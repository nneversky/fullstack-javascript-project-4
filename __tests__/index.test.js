import nock from 'nock';
import path from 'path';
import os from 'os';
import downloadPage from '../src/utils.js';
import { beforeEach, test, expect, describe } from '@jest/globals';

const tmpFilePath = (nameDir) => path.join(os.tmpdir(), nameDir);

describe('Successful download', () => {
  test('Download page', async () => {
    await downloadPage('https://ru.hexlet.io/courses', tmpFilePath('tmpDir\\ru-hexlet-io-courses.html'));
  });
});
