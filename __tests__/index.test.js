import { test, expect, beforeAll } from '@jest/globals';
import pageLoader from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fsp from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tmpFile;
let manifestJson;

const objOutput = { output: path.join(os.tmpdir(), 'testDir') };

beforeAll(async () => {
  await pageLoader('https://ru.hexlet.io/courses', objOutput);

  //   tmpFile = await fsp.readFile(path.join(objOutput.output, 'ru-hexlet-io-courses_files', 'manifest.json'), 'utf-8');
  //   manifestJson = await fsp.readFile(path.join(__dirname, '..', '__fixtures__', 'ru-hexlet-io-courses.json'), 'utf-8');
});

describe('My Test Suite', () => {
  test('test', async () => {
    expect(manifestJson).toEqual(tmpFile);
  });
});
