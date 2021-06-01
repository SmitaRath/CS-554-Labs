function validateArray(argument,type="A"){
    if (!argument) throw `One of the sent parameter is missing`;  
    if (!Array.isArray(argument)) throw `Parameter sent ${argument} is not an array`;
    if (!argument.length>0) throw `Parameter sent ${argument} does not contain any element`;
    }

function validateNumber(argument,type="A"){
        let today = new Date();
        if(!argument && argument!=0) throw `Sent Parameter is missing`;
        if (typeof argument !== "number") throw `Passed argument ${argument} is not a number`;
        if(type!="R")
        if (!Number.isInteger(argument)) throw `Passed argument ${argument} is not an Integer`;
        if(type=="R"){
        if (!Number.isInteger(argument)) throw `Passed argument ${argument} should belong to [1,2,3,4,5]`;
        if (argument<1 || argument >5)  throw `Passed argument is not in the range 1-5`;
        }
        if(type=="Q")
        if (argument<0)  throw `QueryString is invalid`;
        if(type=="Y")
        if (argument<1800 || argument>(today.getFullYear())) throw `Sent Parameter yearReleased ${argument} is not in the valid date range 1800-present year`;

}

function validateString(stringArg){
    if (!stringArg) throw `Sent parameter is missing`;
    if (typeof stringArg !== "string") throw `Parameter sent ${stringArg} is not a string`
    if (stringArg.trim().length == 0) throw `Parameter sent ${stringArg} does not contain any charaters`;
   // if (stringArg.match(/^[0-9!@#\$%\^\&*\)\(+=._-\s]+$/) != null) throw  `Parameter sent ${stringArg} is not a valid string`;

}

function validateObject(argument){
    
    if (!argument) throw `Sent parameter is missing`;    
    if (Array.isArray(argument)) throw `Sent Parameter ${argument} is an array`;
    if (typeof argument !== "object") throw `Sent Parameter ${argument} is not an Object`;
    if (argument.hasOwnProperty(undefined)) throw `Sent Parameter Object contains undefined`;
    let keyCount = Object.keys(argument).length;
    if (keyCount === 0 || keyCount > 2) throw `Sent Parameter object ${argument} doesnot contain valid arguments`;
}

function validateObjectPatch(argument,key1,key2){
    
    if (!argument) throw `Sent parameter is missing`;    
    if (Array.isArray(argument)) throw `Sent Parameter ${argument} is an array`;
    if (typeof argument !== "object") throw `Sent Parameter ${argument} is not an Object`;
    if (argument.hasOwnProperty(undefined)) throw `Sent Parameter Object contains undefined`;
    let keyCount = Object.keys(argument).length;
    if (keyCount === 0 || keyCount > 2) throw `Sent Parameter object ${argument} doesnot contain valid arguments`;
    for(let arr in argument){
        if(arr!=key1 && arr!=key2) throw `Sent Parameter object is invalid`;
    }
}

function validateNumericData(argument){
    if(!argument.match(/^[0-9]+$/))   throw `Sent querystring ${argument} is invalid`;
}

module.exports = {
    validateArray,
    validateNumber,
    validateObject,
    validateString,
    validateObjectPatch,
    validateNumericData
}