import nock from 'nock';
import path from 'path';
import os from 'os';
import downloadPage from '../src/utils.js';

const tmpFilePath = (nameDir) => path.join(os.tmpdir(), nameDir);

test('test', async () => {
  await downloadPage('https://ru.hexlet.io/courses', tmpFilePath('tmpDir\\ru-hexlet-io-courses.html'));
});
