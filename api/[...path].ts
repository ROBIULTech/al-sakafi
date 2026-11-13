import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApiApp } from '../src/server/createApp.ts';

const appPromise = createApiApp().then(({ app }) => app);

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const app = await appPromise;
  app(req, res);
}
