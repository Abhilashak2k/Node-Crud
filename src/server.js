const http = require('http');
const RequestHandler = require('./service/requestHandler');
const requestHandler = new RequestHandler();
require ('dotenv').config();

const server = http.createServer((req, resp)=>{
    requestHandler.handleRequests(req, resp); 
}).listen(process.env.PORT);
console.log('listening on port ' + process.env.PORT);