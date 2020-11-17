// jshint Esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname + '/assets')));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function(req,res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    console.log(firstName);

    const data = {
        "members":[
       {
            email_address:email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            },
        }
      ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/4e93686eb6";
    const options = {
        method: 'POST',
        auth: "Damiosh:4a2e6c5caa8b2297695b1f3f99ad93f1-us2"
    }

   const request = https.request(url, options, function(response){
    if (response.statusCode===200){
        res.sendFile(__dirname + "/success.html")
    }else{res.sendFile(__dirname + "/failure.html")}
        response.on("data", function(data){
            // console.log(JSON.parse(data));
            // const memberObject = (JSON.parse(data));
            
        })
    });
    request.write(jsonData);
    request.end();


})
// respond to post request sent to the failure route
app.post('/failure', function(req,res){
    res.redirect('/')
})

// app listens on dynamic port instead of 3000(local port)
app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});

