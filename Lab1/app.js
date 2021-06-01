const express = require("express");
const app = express();
const configRoutes = require("./routes");
//const session = require('express-session');

app.use(express.json());

/*app.use(
    session({
      name: 'MovieWebApp',
      secret: "This is a movie app",
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 60000 }
    })
  );*/



let totalRequests = 0;
let urlAccessed = {};

app.use('/',async(req,res,next)=>{
    let reqBody = req.body;
    totalRequests++;
    console.log("Log Details");
    console.log("Total request made to the server " + totalRequests);

    console.log("Request Body details " )
    console.log("Request Body")
    if(Object.keys(req.body).length!=0)
    console.log(reqBody);
    else
    console.log("{}");
    console.log(`Requested Url  ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log("HTTP Verb " + req.method);

    if(!urlAccessed[`${req.protocol}://${req.get('host')}${req.originalUrl}`]) {
        urlAccessed[`${req.protocol}://${req.get('host')}${req.originalUrl}`]=0;
    }
    urlAccessed[`${req.protocol}://${req.get('host')}${req.originalUrl}`]++;
    for(let arr in urlAccessed){
    console.log(`This Url ${arr} has been requested ${urlAccessed[arr]}  times`);
    }
    next(); 
});

configRoutes(app);

app.listen(3000,()=>{
    console.log("We've now got a server");
    console.log("your routes will be running on http://localhost:3000");
});