const bluebird = require('bluebird');
const express = require('express');
const configRoutes = require('./routes');
const redis = require('redis');
const client = redis.createClient();
const cors = require("cors");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const app=express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));



app.get("/characters/page/:page", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('characterList/'+req.params.page);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.characterList);
    }
    else
    next();
})

app.get("/characters/search/:search", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('characterList/search/'+req.params.search.toLowerCase());
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.characterList);
    }
    else
    next();
})

app.get("/characters/:id", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('character/single/'+req.params.id);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.character);
    }
    else
    next();
})

app.get("/comics/page/:page", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('comicsList/'+req.params.page);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.comicsList);
    }
    else
    next();
})

app.get("/comics/search/:search", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('comicsList/search/'+req.params.search.toLowerCase());
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.comicsList);
    }
    else
    next();
})

app.get("/comics/:id", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('comics/single/'+req.params.id);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.comic);
    }
    else
    next();
})

app.get("/series/page/:page", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('seriesList/'+req.params.page);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.seriesList);
    }
    else
    next();
})

app.get("/series/search/:search", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('seriesList/search/'+req.params.search.toLowerCase());
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.seriesList);
    }
    else
    next();
})

app.get("/series/:id", async(req,res,next)=>{
    let cacheForShowList = await client.getAsync('series/single/'+req.params.id);
    if(cacheForShowList){
        const recomposedImage = JSON.parse(cacheForShowList);
     
    res.send(recomposedImage.series);
    }
    else
    next();
})

configRoutes(app);
app.listen(4000,()=>{
    console.log("We've got a server now");
    console.log("Your routes will be running on http://localhost:4000");
});


