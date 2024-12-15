import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
}));

// Parse JSON bodies
app.use(express.json());

// Custom middleware to ensure proper JSON responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(body) {
    if (body && typeof body === 'object') {
      // Ensure response follows our standard format
      const response = {
        success: !body.error,
        ...(!body.error ? { data: body } : { error: body.error, details: body.details })
      };
      return originalJson.call(this, response);
    }
    return originalJson.call(this, body);
  };
  next();
});

// Proxy configuration for Netlify Functions
const proxy = createProxyMiddleware({
  target: 'http://localhost:8888',
  changeOrigin: true,
  pathRewrite: {
    '^/.netlify/functions': '/.netlify/functions'
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Content-Type', 'application/json');
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['content-type'] = 'application/json';
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      success: false,
      error: 'Proxy Error',
      details: err.message
    });
  }
});

app.use('/.netlify/functions', proxy);

export const handler = app;