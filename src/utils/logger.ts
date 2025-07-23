// src/utils/logger.ts

import * as fs from 'fs';
import * as path from 'path';

// 1. Setup log directory
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 2. Create a write stream for logging
export const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

// 3. Helper to format any argument nicely (especially objects)
function formatArgs(args: any[]): string {
  return args
    .map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2); // pretty-print objects
        } catch (err) {
          return '[Unserializable Object]';
        }
      }
      return String(arg);
    })
    .join(' ');
}

// 4. Main log writer
export const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] ${msg}\n`);
};

// 5. Override console.log and console.error to log both to file and terminal
export function overrideConsole() {
  console.log = (...args: any[]) => {
    const message = formatArgs(args);
    log(message); // log to file
    process.stdout.write(message + '\n'); // also log to terminal
  };

  console.error = (...args: any[]) => {
    const message = formatArgs(['ERROR:', ...args]);
    log(message);
    process.stderr.write(message + '\n');
  };
}
