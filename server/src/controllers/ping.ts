import { Request, Response } from 'express';
import os from 'os';

function getFormattedServerTime() {
  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  };
  return new Date().toLocaleString('en-US', options);
}

export const pingServer = (req: Request, res: Response) => {
  // Status message
  const status = 'Server is awake!';

  // Health check
  let health = 'Healthy';
  const freeMemoryPercentage = (os.freemem() / os.totalmem()) * 100;

  if (freeMemoryPercentage < 10) {
    health = 'Low memory';
  }

  const serverTime = getFormattedServerTime();

  res.set('Cache-Control', 'no-store');

  return res
    .status(200)
    .send(
      `Status: ${status}<br>Health: ${health}<br>Server Time: ${serverTime}`
    );
};
