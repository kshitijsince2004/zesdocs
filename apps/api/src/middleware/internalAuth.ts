import type { Request, Response, NextFunction } from 'express';

export function internalAuth(req: Request, res: Response, next: NextFunction) {
  const provided = req.headers['x-internal-key'];
  const expected = process.env.INTERNAL_API_KEY || 'dev-internal-key';
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'unauthorized_internal' });
  }
  next();
}
