import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { KeypairSigner } from '@stellaragent/core';
import type { CliIO } from './index.js';

const KEY_DIR_MODE = 0o700;
const KEY_FILE_MODE = 0o600;

export function getKeysDir(): string {
  return join(homedir(), '.stellaragent', 'keys');
}

/** Secret never reaches stdout — only the public address and the file path. */
export async function handleKeysCommand(
  action: string | undefined,
  opts: { secretFile?: string; signerUrl?: string; json?: boolean },
  io: CliIO
): Promise<number> {
  const dir = getKeysDir();
  await mkdir(dir, { recursive: true, mode: KEY_DIR_MODE });

  if (action === 'generate' || action === 'import') {
    const secret = action === 'generate' ? KeypairSigner.random().exportSecret() : undefined;
    const path = join(dir, `${Date.now()}.key`);
    await writeFile(path, secret ?? (await readFile(opts.secretFile ?? '', 'utf8')).trim(), {
      encoding: 'utf8',
      mode: KEY_FILE_MODE,
    });
    io.stdout(`Stored key in ${path} (0600). The secret is never printed.`);
    return 0;
  }

  if (action === 'list') {
    const files = (await readdir(dir)).filter((f) => f.endsWith('.key'));
    if (opts.json) {
      io.stdout(JSON.stringify({ keys: files }, null, 2));
    } else {
      io.stdout(files.length ? files.join('\n') : 'No keys stored.');
    }
    return 0;
  }

  io.stderr('Unknown keys action. Available: generate, import, list');
  return 2;
}
