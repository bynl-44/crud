import express from 'express'
import mongodb from 'mongodb'

const app = express();
const dburl = 'mongodb://ican:gao311161@ds125211.mlab.com:25211/crud'

mongodb.MongoClient.connect(dburl, (err, client) => {
  if (err) {
    throw err
  }

  const db = client.db('crud')
  app.get('/api/games', (req, res) => {
    db.collection('games').find({}).toArray((err, games) => {
      console.log(games)
      res.json({ games })
    })
  })


})

app.use((req, res) => {
  res.status(404).json({
    errors: {
      global: 'Still working on it. Please try again later than when we implement it'
    }
  })
})

app.listen(4000, console.log('server running on localhost:4000'))