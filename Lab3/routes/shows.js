const axios = require('axios');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const express= require('express');
const router=express.Router();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async(req,res)=>{

    try{
        const { data } = await axios.get("http://api.tvmaze.com/shows");

        res.render("showlist",{shows:data}, async function(err, html){
            
            let cacheForShowList = await client.setAsync(
                'showList',
                html);
                res.send(html);
        })
      
    }
    catch(error){
        res.sendStatus(500);
    }
});

router.get("/show/:id", async(req,res)=>{
    const id=req.params.id;
    try{
        const { data } = await axios.get("http://api.tvmaze.com/shows/"+id);

        if(data.summary)
        {
             data.summary=data.summary.replace(/(&nbsp;|<([^>]+)>)/ig,"");
        }

        res.render("show",{show:data}, async function(err, html){
            
            await client.setAsync(
                'show'+id,
                html);
                res.send(html);
        })


      
    }
    catch(error){
        res.status(404);
        res.render("partials/search",{hasErrors:true,message:"No Show found"});
    }

});

router.post("/search", async(req,res)=>{
    try
    {
    let searchTerm = req.body.searchTerm.trim();
        const { data } = await axios.get("http://api.tvmaze.com/search/shows?q="+searchTerm);
        if(data.length!=0){
            
            res.render("searchlist",{shows:data}, async function(err,html){
                await client.setAsync(
                    searchTerm,
                    html);
                    res.send(html);
            });
        }
        else{
            res.status(404);
            res.render("partials/search",{hasErrors:true,message:"Search Result not found"});
        }
    }
catch(error){
    res.sendStatus(500);
}
})

router.get("/popularsearches",async(req,res)=>{

    await client.zrevrange("searchList",0,-1,function(err,members){
        if(members.length!=0)
        res.render("popularshows",{shows:members});
        else
        res.render("partials/search",{hasErrors:true,message:"No Popular Searches"});
      });
})




module.exports=router;