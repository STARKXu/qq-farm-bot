const http = require('http');
const url = require('url');
const QRCode = require('qrcode');

const PORT = process.env.QR_PORT || 3000;

/**
 * 启动本地二维码生成服务
 */
function startQRService() {
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname === '/qr' || pathname === '/') {
            const data = query.data;
            if (!data) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('缺少 data 参数');
                return;
            }

            try {
                // 生成二维码图片 Buffer
                const qrBuffer = await QRCode.toBuffer(data, {
                    type: 'image/png',
                    margin: 2,
                    width: 300
                });

                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': qrBuffer.length
                });
                res.end(qrBuffer);
            } catch (err) {
                console.error('[QR Service] 生成失败:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('二维码生成失败');
            }
        } else {
            res.writeHead(404);
            res.end();
        }
    });

    server.listen(PORT, () => {
        console.log(`[QR Service] 本地服务已启动: http://localhost:${PORT}/qr?data=URL`);
    });

    return server;
}

module.exports = {
    startQRService,
    PORT
};
