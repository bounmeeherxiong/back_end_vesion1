const app = require('./app');
const http = require("http");

const normalizePorts = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePorts(process.env.PORT || 3100);
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Server is running on port ${port}...`));