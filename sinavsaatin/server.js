process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// SinavSaatin - Hostinger entry point
// Forwards to the esbuild-compiled bundle in ./dist/
import('./dist/index.mjs').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
