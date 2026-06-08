export const logger = {
  info: (msg: string, meta?: any) => console.log(msg, meta),
  warn: (msg: string, meta?: any) => console.warn(msg, meta),
  error: (msg: string, meta?: any) => console.error(msg, meta),
};
