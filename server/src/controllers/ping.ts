import { Request, Response } from 'express';
import os from 'os';

export const pingServer = (req: Request, res: Response) => {
  // Status message
  const status = 'Server is awake!';

  // Health check
  let health = 'Healthy';
  const freeMemoryPercentage = (os.freemem() / os.totalmem()) * 100;

  if (freeMemoryPercentage < 10) {
    health = 'Low memory';
  }

  res.set('Cache-Control', 'no-store');

  return res.status(200).send(`Status: ${status}<br>Health: ${health}`);
};
