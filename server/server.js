const http = require('http');
const fs = require('fs');
const {size} = fs.statSync('../example.txt');
const timeStampParam = '2020-01-15T15:34:35.467Z';
const maxLineLengthInBytes = 256;
const dateFormatRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3})Z/g;

function binarySearchInFile(timeStamp, fileDescriptor, startPosition, endPosition, maxLineLengthInBytes, resp) {
    const buffer = new Buffer.alloc(1024);
    fs.read(fileDescriptor, buffer, 0, maxLineLengthInBytes, Math.round((startPosition+endPosition)/2), (err, bytes, buffer)=>{
        const dateParam = new Date(timeStamp);
        const dateMatches = buffer.toString().match(dateFormatRegex);
        if(startPosition >= endPosition){
            resp.writeHead(200);
            resp.end('not found eof');
            return 'not found eof';
        }
        if(dateMatches.includes(timeStamp)){
            console.log(buffer.toString());
            resp.writeHead(200);
            resp.end(buffer.toString());
            return buffer.toString();
        }else {
            midPosition =  Math.round((endPosition + startPosition)/2);
             if(new Date(dateMatches[0]) < dateParam){
                return binarySearchInFile(timeStamp, fileDescriptor, midPosition, endPosition, maxLineLengthInBytes, resp);
             }else{
                return binarySearchInFile(timeStamp, fileDescriptor, startPosition, midPosition, maxLineLengthInBytes, resp);
             }
        }     
    } )
}


const server = http.createServer((req, resp)=>{
    if(req.method == 'GET' && req.url === '/api/getLogs'){
        // not detecting params
       fs.open('../example.txt', 'r', function (err, fd) {
            if (err) {
                resp.writeHead(500);
                resp.end(err.toString());
            }
            const buffer = new Buffer.alloc(1024);
            binarySearchInFile(timeStampParam, fd, 0,  size, maxLineLengthInBytes, resp);
         });
    }
});

server.listen(3000);
console.log('listening on port 3000...');