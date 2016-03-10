var crypto = require('crypto');
var fs = require('promised-io/fs');
var util = require('util');

function validate(queue, password){

    var Deferred = require("promised-io/promise").Deferred;
    var defer = new Deferred();
    fs.readFile("passwd.txt").then(function(text){
        var pw = hashPassword(password);

        if (pw == text.toString()){
            defer.resolve("YAY!!!!!!!");
        }
        else {
            defer.reject("Incorrect password.");
        }
    },
    function(err){
        defer.reject("An error occurred. If this continues, please inform the administrator");
        console.error(err);
    });

    return defer.promise;
}

function hashPassword(password){
    var pwHash = crypto.createHash('sha256');
    pwHash.update(password);
    return pwHash.digest("base64");
}

function updatePasswordFile(hash){
    console.log("Updating password");
    return fs.write("passwd.txt", hash);
}

module.exports = {
    validate: validate,
    hashPassword: hashPassword,
    updatePasswordFile: updatePasswordFile
};