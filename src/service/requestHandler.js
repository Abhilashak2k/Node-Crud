const url = require('url');
const LogFileUtil = require('../utility/logFile');
const logFileUtil = new LogFileUtil('example.txt', 1024);
const dateFormatRegex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3})Z/g;

class RequestHandler {

    handleRequests(req, resp) {
        const urlObj = url.parse(req.url, true, true);
        if(req.method == 'GET' && urlObj.pathname === '/api/getLogs'){
            this.returnFileLogsForTimestamp(req, resp);
        }else{
            resp.writeHead(404);
            resp.end();
        }
    }

    returnFileLogsForTimestamp(req, resp) {
        const queryObject = url.parse(req.url, true).query;
        const startTimeStampParam = queryObject.startTimeStamp;
        const endTimeStampParam = queryObject.endTimeStamp;
        logFileUtil.searchInFile(startTimeStampParam, endTimeStampParam, dateFormatRegex).then(data=>{
           resp.writeHead(200);
           resp.end(data);
        });
    }
}

module.exports = RequestHandler;