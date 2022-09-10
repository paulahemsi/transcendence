import { createProxyMiddleware} from 'http-proxy-middleware';

module.exports = function(app: any) {
    app.use(createProxyMiddleware("/auth", { target: "http://localhost:4444/auth", changeOrigin: true }));
    app.use(createProxyMiddleware("/users", { target: "http://localhost:4444/users", changeOrigin: true }));
};