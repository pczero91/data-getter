const http = require('http');
const fs = require('fs');
const path = require('path');
const { DataGetter } = require('../lib/DataGetter');

const server = http.createServer();

server.on('request', (req, res) => {
    if (req.url == '/') {
        fs.readFile(path.join(__dirname, 'test.html'), (err, data) => {
            if (err) throw err;
            res.writeHead(200, {'content-type': 'text/html'});
            res.write(data)
            res.end();
        });
    } else if (req.url == '/post') {
        DataGetter.getData(req, (bytes, file, type, name) => {
            // console.log(bytes.toString().trim());
        }, (heads) => {
            let pairs = {};
            heads.forEach((h) => {
                pairs[h.name] = h.data.toString().trim();
            });
            console.log(pairs);
        });
        fs.readFile(path.join(__dirname, 'post.html'), (err, data) => {
            if (err) throw err;
            res.writeHead(200, {'content-type': 'text/html'});
            res.write(data)
            res.end();
        });
    } else {
        res.writeHead(404, {'content-type': 'text/plain'});
        res.write('Error');
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Listening...');
})