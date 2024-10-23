
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; 
const client = new MongoClient(url);


const dbName = 'movieDB';

async function findMovies() {
 
  await client.connect();
  console.log('Connected to database');

  const db = client.db(dbName);
  const collection = db.collection('movies');

 
  const familyMovies = await collection.find({ genre: 'Family' }).toArray();
  console.log('Family Movies:', familyMovies);

  
  const fantasyAnimationMovies = await collection.find({
    genre: { $elemMatch: { $in: ['Fantasy', 'Animation'] } }
  }).toArray();
  console.log('Fantasy and Animation Movies:', fantasyAnimationMovies);


  const actionThreeGenresMovies = await collection.find({
    genre: 'Action',
    $expr: { $eq: [{ $size: "$genre" }, 3] }
  }).toArray();
  
  console.log('Action Movies with exactly three genres:', actionThreeGenresMovies);
  

  
  const documentaryMovies = await collection.find(
    { genre: 'Action' },
    { projection: { title: 1, release_date: 1, overview: 1 } }
  ).toArray();
  console.log('Action Movies (projected):', documentaryMovies);


  const adventureMovies = await collection.find(
    {
      genre: 'Adventure',
     
      vote_average: { $gt: 8 }
    },
    { projection: { title: 1, genre: 1, popularity: 1 } }
  ).toArray();
  console.log('Adventure Movies with vote average > 8:', adventureMovies);

  await client.close();
}


findMovies().catch(console.error);
