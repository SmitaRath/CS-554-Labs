const axios = require('axios');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const express= require('express');
const router=express.Router();
const publickey = 'f948df04b7c96a2ca3b7ab905b17c1aa';
const privatekey = '19bfee307804ebc7b582e2391ef15aa96bf2261b';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const md5 = require('blueimp-md5');
const hash = md5(stringToHash);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/characters/page/:page", async(req,res)=>{

    try{
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
		const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash +"&offset="+req.params.page*20;
 
        const { data } = await axios.get(url);
        let details={
        characterList:data.data.results
      }
      const jsonDetails = JSON.stringify(details);
      await client.setAsync("characterList/"+req.params.page, jsonDetails);  
      res.json(data.data.results);     
    }
    catch(error){
    
        res.sendStatus(404);
    }
});

router.get("/characters/search/:search", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith='+req.params.search;
    const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    try{
        const { data } = await axios.get(url);

        let details={
            characterList:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("characterList/search/"+req.params.search.toLowerCase(), jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});

router.get("/characters/:id", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?id='+req.params.id;
	const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    try{
        const { data } = await axios.get(url);

        let details={
            character:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("character/single/"+req.params.id, jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});

router.get("/comics/page/:page", async(req,res)=>{

    try{
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
		const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash +"&offset="+req.params.page*20;
      
        const { data } = await axios.get(url);
        let details={
        comicsList:data.data.results
      }
      const jsonDetails = JSON.stringify(details);
      await client.setAsync("comicsList/"+req.params.page, jsonDetails);  
      res.json(data.data.results);     
    }
    catch(error){
       
        res.sendStatus(404);
    }
});

router.get("/comics/search/:search", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics?titleStartsWith='+req.params.search;
    const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    try{
        const { data } = await axios.get(url);

        let details={
            comicsList:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("comicsList/search/"+req.params.search.toLowerCase(), jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});

router.get("/comics/:id", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics?id='+req.params.id;
	const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    try{
        const { data } = await axios.get(url);

        let details={
            comic:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("comics/single/"+req.params.id, jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});

router.get("/series/page/:page", async(req,res)=>{

    try{
        const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
		const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash +"&offset="+req.params.page*20;
     
        const { data } = await axios.get(url);
        let details={
        seriesList:data.data.results
      }
      const jsonDetails = JSON.stringify(details);
      await client.setAsync("seriesList/"+req.params.page, jsonDetails);  
      res.json(data.data.results);     
    }
    catch(error){
      
        res.sendStatus(404);
    }
});

router.get("/series/search/:search", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/series?titleStartsWith='+req.params.search;
    const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    try{
        const { data } = await axios.get(url);

        let details={
            seriesList:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("seriesList/search/"+req.params.search.toLowerCase(), jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});

router.get("/series/:id", async(req,res)=>{
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/series?id='+req.params.id;
	const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    try{
        const { data } = await axios.get(url);

        let details={
            series:data.data.results
          }
            
          const jsonDetails = JSON.stringify(details);
          await client.setAsync("series/single/"+req.params.id, jsonDetails);  
          res.json(data.data.results); 
      
    }
    catch(error){
        res.sendStatus(404);
    }

});


module.exports=router;