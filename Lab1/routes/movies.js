const express = require("express");
const { ObjectID } = require("mongodb");
const router = express.Router();
const data = require("../data");
const movies = data.movies;
const validate = data.validate;

router.post("/", async(req,res)=>{
    let movReq = req.body;

    2
    if(!movReq){
        res.status(400).json({ error: 'You must provide data to add a Movie' });
        return;
    }

    try{
        validate.validateString(movReq.title);
    }
    catch(e){
        res.status(400).json({ error: "title : " +  e });
        return;
    }

    try{
        validate.validateArray(movReq.cast);
        for(let cast of movReq.cast){
            validate.validateObject(cast);
            validate.validateString(cast.firstName);
            validate.validateString(cast.lastName);
        }
    }
    catch(e){
        res.status(400).json({ error: "cast : " +  e });
        return;
    }

    try{
        validate.validateObject(movReq.info);
        validate.validateString(movReq.info.director);
        validate.validateNumber(movReq.info.yearReleased,"Y");
    }
    catch(e){
        res.status(400).json({ error: "info : " +  e });
        return;
    }

    

    try{
        validate.validateString(movReq.plot);
    }
    catch(e){
        res.status(400).json({ error: "plot - " +  e });
        return;
    }

    try{
        validate.validateNumber(movReq.rating,"R");
    }
    catch(e){
        res.status(400).json({ error: "rating : " +  e });
        return;
    }

    
    try{   
        const newMovie = await movies.create(movReq.title,movReq.cast,movReq.info,movReq.plot,movReq.rating);
        res.json(newMovie);
    }
    catch(e){
        res.status(400).json({error: e});
    }
    
});

router.get("/", async(req,res)=>{
    let take;
    let skip;
    try{
    if(Object.keys(req.query).length!=0){
        for(let arr in req.query){
            if(arr!="take" && arr!="skip"){
                res.status(400).json({error:"Query String not allowed"});
            return;
            }
        }
        if(req.query.take && req.query.skip){
            validate.validateNumericData(req.query.take);
            validate.validateNumericData(req.query.skip);
            take = parseFloat(req.query.take);
            skip = parseFloat(req.query.skip);
            if(Number.isNaN(take)) throw `Sent querystring ${req.query.take} is not number`;
            if(Number.isNaN(skip)) throw `Sent querystring ${req.query.skip} is not number`;
            validate.validateNumber(take,"Q");
            validate.validateNumber(skip,"Q");
            if(take>100) take=100;
        }
        else if(req.query.take){
            validate.validateNumericData(req.query.take);
            take = parseFloat(req.query.take);
            if(Number.isNaN(take)) throw `Sent querystring ${req.query.take} is not number`;
            validate.validateNumber(take,"Q");
            if(take>100) take=100;
        }
        else if(req.query.skip){
            validate.validateNumericData(req.query.skip);
            skip = parseFloat(req.query.skip);
            if(Number.isNaN(skip)) throw `Sent querystring ${req.query.skip} is not number`;
            validate.validateNumber(skip,"Q");
        }
        else{
            res.status(400).json({error:"Query String not allowed"});
            return;
        }
        }
    }
    catch(e){
        res.status(400);
        res.json({error:e});
        return;
    }

    try{
        const allMovies = await movies.getMovies(take,skip);
        res.json(allMovies); 
    }
    catch(err){
        res.status(500).json({error:err});
    } 

});

router.get("/:id", async(req,res)=>{
    
    try{
        let parsedId = new ObjectID(req.params.id);
    }
    catch(e){
        res.status(400);
        res.json({error:e.message});
        return;
    }

    try{
        const movie = await movies.getMovie(req.params.id);
        res.json(movie);
    }
    catch(e){
        res.status(404);
        res.json({error : e});
    }
})

router.put("/:id", async(req,res)=>{
    let movReq = req.body;
    try{
        let parsedId = new ObjectID(req.params.id);
    }
    catch(e){
        res.status(400);
        res.json({error:e.message});
        return;
    }

    try{
        const existingMovie = await movies.getMovie(req.params.id);
        }
        catch(e){
        res.status(404);
        res.json({error:e});
        return;
        }

    try{
        validate.validateString(movReq.title);
    }
    catch(e){
        res.status(400).json({ error: "title : " +  e });
        return;
    }

    try{
        validate.validateArray(movReq.cast);
        for(let cast of movReq.cast){
            validate.validateObject(cast);
            validate.validateString(cast.firstName);
            validate.validateString(cast.lastName);
        }
    }
    catch(e){
        res.status(400).json({ error: "cast : " +  e });
        return;
    }

    try{
        validate.validateObject(movReq.info);
        validate.validateString(movReq.info.director);
        validate.validateNumber(movReq.info.yearReleased,"Y");
    }
    catch(e){
        res.status(400).json({ error: "info : " +  e });
        return;
    }

    

    try{
        validate.validateString(movReq.plot);
    }
    catch(e){
        res.status(400).json({ error: "plot - " +  e });
        return;
    }

    try{
        validate.validateNumber(movReq.rating,"R");
    }
    catch(e){
        res.status(400).json({ error: "rating : " +  e });
        return;
    }

    try{
        const updatedMovie = await movies.updateFullMovie(req.params.id,movReq.title,movReq.cast,movReq.info,movReq.plot,movReq.rating);
        res.json(updatedMovie);   
    }
    catch(e){
        res.status(400);
        res.json({error:e});
    }

});

router.patch("/:id" , async(req,res)=>{
    let newMovieObject = req.body;
    let newFlag=false;
    let count=0;
    try{
        let parsedId = new ObjectID(req.params.id);
    }
    catch(e){
        res.status(400);
        res.json({error:e.message});
        return;
    } 

    let existingMovie; 
    try{
    existingMovie = await movies.getMovie(req.params.id);
    }
    catch(e){
    res.status(404);
    res.json({error:e});
    return;
    } 

    if(newMovieObject.title){
        
            try{
                validate.validateString(newMovieObject.title);
                if(existingMovie.title!=newMovieObject.title.trim()) newFlag=true;
            }
            catch(e){
                res.status(400).json({ error: "title : " +  e });
                return;
            }
    }
    

    if(newMovieObject.cast){
      try{
        validate.validateArray(newMovieObject.cast);
        for(let cast of newMovieObject.cast){
            validate.validateObject(cast);
            validate.validateString(cast.firstName);
            validate.validateString(cast.lastName);
            count=0;
            for(let arr of existingMovie.cast){
                if(arr.firstName===cast.firstName.trim() && arr.lastName===cast.lastName.trim())
                break;
                count++;
            }
            if(count==existingMovie.cast.length)
            newFlag=true;
            
        }
    }
    catch(e){
        res.status(400)
        res.json({ error: "cast : " +  e });
        return;
    }
    }

     if(newMovieObject.info){
         try{
         validate.validateObjectPatch(newMovieObject.info,"director","yearReleased");
         if(newMovieObject.info.director && newMovieObject.info.director.trim()!=existingMovie.info.director) {
            newFlag=true;
            validate.validateString(newMovieObject.info.director);
         }
         if(newMovieObject.info.yearReleased && newMovieObject.info.yearReleased!=existingMovie.info.yearReleased){
            newFlag=true;
            validate.validateNumber(newMovieObject.info.yearReleased,"Y");
         }
        }
        catch(e){
            res.status(400).json({ error: "info : " +  e });
            return;
        }
    }

    if(newMovieObject.plot){
        try{
        validate.validateString(newMovieObject.plot);
        if(newMovieObject.plot.trim() != existingMovie.plot)
        newFlag=true;
        }
        catch(e){
            res.status(400)
            res.json({ error: "plot : " +  e });
            return; 
        }
    }

    if(newMovieObject.rating || newMovieObject.rating==0){
        try{
        validate.validateNumber(newMovieObject.rating,"R");
        if(newMovieObject.rating != existingMovie.rating)
        newFlag=true;
        }
        catch(e){
            res.status(400)
            res.json({ error: "rating : " +  e });
            return; 
        }
    }

    if(newFlag){
    try{
        const updatedMovie = await movies.patchMovie(req.params.id,req.body);
        res.json(updatedMovie);
    }
    catch(e){
        res.status(404);
        res.json({error:e});
    }
}
else{
    res.status(400);
    res.json({error:"Please provide new details to update"});
}
});

router.post("/:id/comments", async(req,res)=>{

    try{
        let parsedId = new ObjectID(req.params.id);
    }
    catch(e){
        res.status(400);
        res.json({error:e.message});
        return;
    }

    try{
        const existingMovie = await movies.getMovie(req.params.id);
        }
        catch(e){
        res.status(404);
        res.json({error:e});
        return;
        }

    try{
        validate.validateString(req.body.name);
    }
    catch(e){
        res.status(400).json({ error: "name : " +  e });
        return;
    }

    try{
        validate.validateString(req.body.comment);
    }
    catch(e){
        res.status(400).json({ error: "comment : " +  e });
        return;
    }

    try{
        const updatedMovie = await movies.addComment(req.params.id,req.body);
        res.json(updatedMovie);
    }
    catch(e){
        res.status(404);
        res.json({error:e});
    }
});

router.delete("/:movieId/:commentId", async(req,res)=>{
    try{
        let parsedMovieId = new ObjectID(req.params.movieId);
        let parsedCommentId = new ObjectID(req.params.commentId);
    }
    catch(e){
        res.status(400);
        res.json({error:e.message});
        return;
    }

    try{
        const updatedMovie = await movies.deleteComment(req.params.movieId,req.params.commentId);
        res.json(updatedMovie);
    }
    catch(e){
        res.status(404);
        res.json({error:e});
    }
});

module.exports=router;
