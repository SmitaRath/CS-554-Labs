const dbConnection = require('../config/mongoConnection');
let { ObjectID } = require('mongodb');

const main = async () =>   
{
    const db = await dbConnection();

    try {
      await db.collection('movies').drop();
    } catch (e) {
    }

    let newMovie1={
        title : "Titanic",
        cast : [{"firstName":"Leonardo","lastName":"Dicaprio"},{"firstName":"kate","lastName":"Winslet"}],
        info :  {director: "James Cameron", yearReleased: 1997},
        plot : "James Cameron's Titanic is an epic, action-packed romance set against the ill-fated maiden voyage of the R.M.S. Titanic; the pride and joy of the White Star Line and, at the time, the largest moving object ever built. She was the most luxurious liner of her era -- the ship of dreams -- which ultimately carried over 1,500 people to their death in the ice cold waters of the North Atlantic in the early hours of April 15, 1912.",
        rating : 5,
        comments : []            
    }

    let newMovie2={
        title : "Gravity",
        "cast": [{firstName: "George", lastName:"Clooney"},{firstName: "Sandra", lastName:"Bullock"}],
        info :  {director: "Alfonso Cuaron", yearReleased: 2013},
        plot : "Dr. Ryan Stone (Sandra Bullock) is a medical engineer on her first shuttle mission. Her commander is veteran astronaut Matt Kowalsky (George Clooney), helming his last flight before retirement. Then, during a routine space walk by the pair, disaster strikes: The shuttle is destroyed, leaving Ryan and Matt stranded in deep space with no link to Earth and no hope of rescue. As fear turns to panic, they realize that the only way home may be to venture further into space.",
        rating : 4,
        comments : []            
    }

    let newMovie3={
        title : "Constantine",
        "cast": [{firstName: "Keanu", lastName:"Reeves"},{firstName: "Alex", lastName:"Winter"}],
        info :  {director: "Francis Lawrence", yearReleased: 2005},
        plot : "As a suicide survivor, demon hunter John Constantine (Keanu Reeves) has literally been to hell and back -- and he knows that when he dies, he's got a one-way ticket to Satan's realm unless he can earn enough goodwill to climb God's stairway to heaven. While helping policewoman Angela Dodson (Rachel Weisz) investigate her identical twin's apparent suicide, Constantine becomes caught up in a supernatural plot involving both demonic and angelic forces. Based on the DC/Vertigo Hellblazer comics.",
        rating : 4,
        comments : []            
    }

    let newMovie4 = {
            "title": "Bill and Ted Face the Music",
            "cast": [{firstName: "Keanu", lastName:"Reeves"},{firstName: "Alex", lastName:"Winter"}],
            "info": {director: "Dean Parisot", yearReleased: 2020},  
            "plot": "Once told they'd save the universe during a time-traveling adventure, 2 would-be rockers from San Dimas, California find themselves as middle-aged dads still trying to crank out a hit song and fulfill their destiny.",
            "rating": 4.5,
            comments : [] 
    }


const moviesCollection = await db.collection('movies');
const movie1 = await moviesCollection.insertOne(newMovie1);
await moviesCollection.insertOne(newMovie2);
await moviesCollection.insertOne(newMovie3);
await moviesCollection.insertOne(newMovie4);

const updatedMovie = 
{
_id: new ObjectID(),
name:"Tom",
comment:"Good"
}
await moviesCollection.updateOne({_id:movie1.insertedId},{$addToSet:{comments:updatedMovie}});

await db.serverConfig.close();
} 

main().catch(console.log);