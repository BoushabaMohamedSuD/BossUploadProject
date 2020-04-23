
//////////////////////////////////////

//    DONT FORGET TO ADD CONTENT TYPE IN THE HEADER
//    


///////////////////////////////



const AWS = require("aws-sdk");
var s3 = new AWS.S3();
var fs = require('fs');
const axios = require('axios').default;
//var FormData = require('form-data');

var params = {
    Bucket: 'private-bossupload',
    Key: 'Test1/Datacenter.pdf',
    ContentType: "multipart/form-data",
    Expires: 20
};
s3.getSignedUrl('putObject', params, function (err, url) {
    if (err) {
        console.log(err);
    } else {
        console.log('The URL is', url);
        /* fs.readFile('C:\\Users\\mohamed\\Downloads\\Datacenter.pdf', function (err, contents) {
             if (err) {
                 console.log("error")
                 console.log(err)
             } else {
                 if (contents != null) {
                     console.log(contents)
 
                     const formData = new FormData();
                     formData.append("Datacenter.pdf", contents);
                     axios.put(url, contents)
                         .then(function (response) {
 
                             console.log(response);
                             console.log("ok");
                         })
                         .catch(function (error) {
 
                             console.log(error);
                             console.log("not ok");
                         });
 
                 } else {
                     console.log("contents is null")
                 }
 
             }
         });*/
    }
});




/*
fs.readFile('C:\\Users\\mohamed\\Downloads\\Datacenter.pdf', function (err, contents) {
    if (err) {
        console.log("error")
        console.log(err)
    } else {
        if (contents != null) {
            console.log(contents)
            //console.log(contents.lenght)
            let params = { Bucket: 'public-bossuplaod/Test', Key: "Datacenter.pdf", Body: contents };
            //var options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
            s3.upload(params, function (err, data) {
                if (err) {
                    console.log(err)
                    console.log('error');
                } else {
                    console.log(data)
                    console.log('ok')
                }

            })

        } else {
            console.log("contents is null")
        }

    }

});*/


/*
var params = {
    Bucket: 'public-bossuplaod',
    Fields: {
        key: 'Datacenter.pdf',
        expiration: 3600,
    }
};
s3.createPresignedPost(params, function (err, data) {
    if (err) {
        console.error('Presigning post data encountered an error', err);
    } else {
        console.log('The post data is', data);
    }
});*/