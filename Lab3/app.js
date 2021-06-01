const bluebird = require('bluebird');
const express = require('express');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const static = express.static(__dirname + '/public');
app.use('/public',static);
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


app.get("/", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('showList');
    if(cacheForShowList)
    res.send(cacheForShowList);
    else
    next();
})

app.get("/show/:id", async(req,res,next)=>{

    let cacheForShow = await client.getAsync("show"+req.params.id);
    if(cacheForShow)
    res.send(cacheForShow);
    else
    next();
})

app.post("/search", async(req,res,next)=>{
    let searchTerm = req.body.searchTerm.trim();
    if(searchTerm){
        await client.zscore("searchList",searchTerm, async function(err,reply){
        if(reply){
            await client.ZINCRBY("searchList",1,searchTerm);
            
            const showResult = await client.getAsync(searchTerm);
            if(showResult){
            res.send(showResult);
            }
            else{
                res.status(404);
                res.render("partials/search",{hasErrors:true,message:"Search Result not found"});
            }
        }
        else{
            await client.zadd("searchList",1,searchTerm);
            next();
        }
    });
}
else{
    res.status(400).render("partials/search",{hasErrors:true,message:"Please provide a value"});
}
})

configRoutes(app);
app.listen(3000,()=>{
    console.log("We've got a server now");
    console.log("Your routes will be running on http://localhost:3000");
});


