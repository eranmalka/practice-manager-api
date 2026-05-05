import { Logger } from '@nestjs/common';
import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const logger = new Logger('Env');

function stripBom(content: string): string {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

/**
 * Load one `.env` file into `process.env`.
 * Trims keys/values (Windows CRLF / stray spaces).
 * Strips UTF-8 BOM so the first key is never `\ufeffGOOGLE_...`.
 */
function applyEnvFile(filePath: string, override: boolean): number {
  if (!existsSync(filePath)) {
    return 0;
  }
  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    logger.warn(`Could not read ${filePath}`);
    return 0;
  }
  const parsed = parse(stripBom(raw));
  let applied = 0;
  for (const [key, value] of Object.entries(parsed)) {
    const k = key.trim();
    const v = value.trim();
    if (!k) continue;
    if (override || process.env[k] === undefined) {
      process.env[k] = v;
      applied++;
    }
  }
  if (applied > 0) {
    logger.log(
      `Loaded ${filePath} (${applied} variable(s)${override ? ', override' : ''})`,
    );
  }
  return applied;
}

/**
 * Must be imported before `./app.module` in `main.ts` so JwtModule.register and strategies see env.
 */
function loadEnvFromProjectRoots(): void {
  const roots = [...new Set([process.cwd(), resolve(__dirname, '..')])];

  for (const root of roots) {
    applyEnvFile(resolve(root, '.env'), false);
  }
  for (const root of roots) {
    applyEnvFile(resolve(root, '.env.local'), true);
  }

  if (
    !process.env.GOOGLE_CLIENT_ID?.trim() ||
    !process.env.GOOGLE_CLIENT_SECRET?.trim()
  ) {
    logger.warn(
      `Google OAuth env missing. Searched .env under: ${roots.join(' | ')}`,
    );
  }
}

loadEnvFromProjectRoots();
