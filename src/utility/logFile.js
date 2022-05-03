const fs = require('fs');
const bufferSize = 1024;
class LogFileUtility {

    constructor(filePath, maxLineLengthInBytes){
        this.fileDescriptor = fs.openSync(filePath, 'r');
        this.fileSizeInBytes = fs.statSync(filePath);
        this.maxLineLengthInBytes = maxLineLengthInBytes;
    }

    searchInFile(toSearchStringStart, toSearchStringEnd, searchStringRegex){
        return this.binarySearchInFile(toSearchStringStart, toSearchStringEnd, 0, this.fileSizeInBytes, searchStringRegex);
    }

    binarySearchInFile(toSearchStringStart, toSearchStringEnd, startPosition, endPosition, searchStringRegex) {
        const buffer = new Buffer.alloc(bufferSize);
        return new Promise ((resolve)=>{
            fs.read(this.fileDescriptor, buffer, 0, this.maxLineLengthInBytes, Math.round((startPosition+endPosition)/2), (err, bytes, buffer)=>{
                const dateParam = new Date(toSearchStringStart);
                const dateMatches = buffer.toString().match(searchStringRegex);
                
                if(startPosition >= endPosition){
                    resolve('Logs Not Found');
                }
                if(!dateMatches){
                    //console.log(startPosition);
                }
                else if(dateMatches && dateMatches.includes(toSearchStringStart)){
                    resolve(buffer.toString());
                }else if(dateMatches) {
                    const midPosition =  Math.round((endPosition + startPosition)/2);
                    console.log(midPosition);
                     if(new Date(dateMatches[0]) < dateParam){
                        resolve(this.binarySearchInFile(toSearchStringStart, toSearchStringEnd, midPosition, endPosition, searchStringRegex));
                     }else{
                        resolve(this.binarySearchInFile(toSearchStringStart, toSearchStringEnd, startPosition, midPosition, searchStringRegex));
                     }
                }     
            } )
        });
    }
}

module.exports = LogFileUtility;