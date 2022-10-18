const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware('/api', {
        target: 'https://localhost:7178',        
        changeOrigin: true,
        secure: false
    });

    app.use(appProxy);
};
