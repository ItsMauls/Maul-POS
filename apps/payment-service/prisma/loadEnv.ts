import * as dotenv from 'dotenv';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const configPath = path.resolve(__dirname, '../cmd/config.yml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, string>;

Object.entries(config).forEach(([key, value]) => {
  process.env[key] = value;
});