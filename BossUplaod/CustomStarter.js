console.log("hi mohamed");
console.log("we are going to start your sam project");
console.log("be happy :)");

var exec = require('child_process').exec;

exec("sam local start-api", (err, sout, serr) => {
    if (err) {
        console.log("error in the execution of the methode");
        console.log(serr);
    }
    console.log(sout);


});