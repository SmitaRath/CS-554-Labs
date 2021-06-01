const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
let { ObjectID } = require('mongodb');
const validate = require('./validate');

async function create(title, cast, info, plot, rating){
    validate.validateString(title);
    validate.validateArray(cast);
    for(let arr of cast){
        validate.validateObject(arr);
        validate.validateString(arr.firstName);
        validate.validateString(arr.lastName);
    }
    validate.validateObject(info);
    validate.validateString(info.director);
    validate.validateNumber(info.yearReleased,"Y");
    validate.validateString(plot);
    validate.validateNumber(rating,"R");

    const moviesCollection = await movies();

    let modifiedCast = cast.map((obj)=>{
        obj.firstName=obj.firstName.trim();
        obj.lastName=obj.lastName.trim();
        return obj;
    })

    info["director"]=info["director"].trim();

    let newMovie={
        title : title.trim(),
        cast : modifiedCast,
        info : info,
        plot : plot.trim(),
        rating : rating,
        comments : []            
    }

    const insertInfo = await moviesCollection.insertOne(newMovie);
    if (insertInfo === 0) throw `Could not add new Movie`;

    const newId = insertInfo.insertedId;
    const movie = await getMovie(newId.toString());
    return movie;
}

async function getMovie(id){
    let parsedId = new ObjectID(id);
    const moviesCollection = await movies();
    const newMovie = await moviesCollection.findOne({_id:parsedId});
    if(newMovie==null) throw `Movie is not available with the id ${id}`;
    newMovie._id = newMovie._id.toString();
    for(let arr of newMovie.comments){
        arr._id=arr._id.toString();
    }
    return newMovie;
}

async function getMovies(take,skipVar){
    const moviesCollection = await movies();
    let allMovies=[];
    
    if(skipVar && take){
        validate.validateNumber(skipVar,"Q");
        validate.validateNumber(take,"Q");
        allMovies = await moviesCollection.find({}).skip(skipVar).limit(take).toArray();
    }
    else if(take){
        validate.validateNumber(take,"Q");
    allMovies = await moviesCollection.find({}).limit(take).toArray();
    }
    else if(skipVar){
    validate.validateNumber(skipVar,"Q");
    if(take!=0)
    allMovies = await moviesCollection.find({}).skip(skipVar).limit(20).toArray();
    }
    else
    if(take!=0)
    allMovies = await moviesCollection.find({}).limit(20).toArray();

    for(let arr of allMovies){
        arr._id=arr._id.toString();
        for(let comm of arr.comments){
            comm._id=comm._id.toString();

        }
    }
    return allMovies;
    
}

async function updateFullMovie(id,title, cast, info, plot, rating){
    let parsedId = new ObjectID(id);
    const existingMovie = await getMovie(id);
    validate.validateString(title);
    validate.validateArray(cast);
    for(let arr of cast){
        validate.validateObject(arr);
        validate.validateString(arr.firstName);
        validate.validateString(arr.lastName);
    }
    validate.validateObject(info);
    validate.validateString(info.director);
    validate.validateNumber(info.yearReleased,"Y");
    validate.validateString(plot);
    validate.validateNumber(rating,"R");
   
    const moviesCollection = await movies();

    let modifiedCast = cast.map((obj)=>{
        obj.firstName=obj.firstName.trim();
        obj.lastName=obj.lastName.trim();
        return obj;
    })

    info["director"]=info["director"].trim();

    let updatedMovie={
        title : title.trim(),
        cast : modifiedCast,
        info : info,
        plot : plot.trim(),
        rating : rating           
    }

    const updateInfo = await moviesCollection.updateOne({_id:parsedId},{$set:updatedMovie});
    if(updateInfo.modifiedCount==0) throw `Could not update movie for the id ${id}, provide new details to update`;

    const movie = await getMovie(id);
    return movie;   
}

async function patchMovie(id,movieObject){
    let parsedId=new ObjectID(id);
    const moviesCollection = await movies();
    const existingMovie = await getMovie(id);
    let updatedMovie={};
    if(movieObject.title){
        validate.validateString(movieObject.title);
        updatedMovie.title=movieObject.title.trim();
    }
    if(movieObject.cast){
        validate.validateArray(movieObject.cast);
        for(let arr of movieObject.cast){
            validate.validateObject(arr);
            validate.validateString(arr.firstName);
            validate.validateString(arr.lastName);
            arr.firstName=arr.firstName.trim();
            arr.lastName=arr.lastName.trim();

            const updateInfo = await moviesCollection.updateOne({_id:parsedId},{$addToSet:{cast:arr}});
        }

 /*       let modifiedCast = movieObject.cast.map((obj)=>{
            obj.firstName=obj.firstName.trim();
            obj.lastName=obj.lastName.trim();
            return obj;
        })

        updatedMovie.cast = modifiedCast; */
    }

    if(movieObject.info){
        let keyCount = Object.keys(movieObject.info).length;
            validate.validateObjectPatch(movieObject.info,"director","yearReleased");
            if(keyCount===2){
                updatedMovie.info = movieObject.info;
                validate.validateString(movieObject.info.director);
                validate.validateNumber(movieObject.info.yearReleased,"Y");
                updatedMovie.info["director"]=movieObject.info["director"].trim();
            }
            else if(movieObject.info.director){
                validate.validateString(movieObject.info.director);
                existingMovie.info.director = movieObject.info.director.trim();
                updatedMovie.info = existingMovie.info;
            }
            else if(movieObject.info.yearReleased){
                validate.validateNumber(movieObject.info.yearReleased,"Y");
                existingMovie.info.yearReleased = movieObject.info.yearReleased;
                updatedMovie.info = existingMovie.info;
            }
    }

    if(movieObject.plot){
        validate.validateString(movieObject.plot);
        updatedMovie.plot=movieObject.plot.trim();
    }

    if(movieObject.rating || movieObject.rating==0){
        validate.validateNumber(movieObject.rating,"R");
        updatedMovie.rating=movieObject.rating;
    }
    let updateInfo={};
    if(Object.keys(updatedMovie).length!=0)
    updateInfo = await moviesCollection.updateOne({_id:parsedId},{$set:updatedMovie});

    const movie = await getMovie(id);
    return movie;
}

async function addComment(id,commentObject){
    let parsedId=new ObjectID(id);
    const existingMovie = await getMovie(id);
    validate.validateString(commentObject.name);
    validate.validateString(commentObject.comment);
    let newComment = {
        _id:new ObjectID(),
        name : commentObject.name.trim(),
        comment:commentObject.comment.trim()
    }
    const moviesCollection = await movies();
    const updateInfo = await moviesCollection.updateOne({_id:parsedId},{$addToSet:{comments:newComment}});
    if(updateInfo.modifiedCount==0) throw `Could not update movie for the id ${id}`;

    const movie = await getMovie(id);
    return movie;
}

async function deleteComment(movieId,commentID){
    let parsedMovieId= new ObjectID(movieId);
    let parsedCommentId = new ObjectID(commentID);
    const existingMovie = await getMovie(movieId);
    const moviesCollection = await movies();
    const deleteInfo = await moviesCollection.updateOne({_id:parsedMovieId},{$pull:{comments:{_id:parsedCommentId}}});
    if(deleteInfo.modifiedCount==0) throw `Could not delete the comment for the id ${commentID}`;

    const mov = await getMovie(movieId);
    return mov;
}

module.exports={
    create,
    getMovie,
    getMovies,
    updateFullMovie,
    patchMovie,
    addComment,
    deleteComment
}