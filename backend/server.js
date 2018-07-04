import express from 'express'
import bodyParser from 'body-parser'
import mongodb from 'mongodb'

const app = express();
app.use(bodyParser.json())
const dburl = 'mongodb://ican:gao311161@ds125211.mlab.com:25211/crud'

const validate = data => {
  let errors = {};
  if (data.title === '') errors.title = 'Can`t be empty'
  if (data.cover === '') errors.cover = 'Can`t be empty'

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid }
}

mongodb.MongoClient.connect(dburl, (err, client) => {
  if (err) {
    throw err
  }

  const db = client.db('crud')
  app.get('/api/games', (req, res) => {
    db.collection('games').find({}).toArray((err, games) => {
      res.json({ games })
    })
  })

  app.post('/api/games', (req, res) => {
    const { errors, isValid } = validate(req.body)
    if (isValid) {
      const { title, cover } = req.body
      db.collection('games').insert({ title, cover }, (err, result) => {
        if (err) {
          res.status(500).json({ errors: { global: 'Something went wrong' } })
        } else {
          res.json({ game: result.ops[0] })
        }
      })
    } else {
      res.status(400).json({ errors })
    }
  })

  app.get(`/api/games/:id`, (req, res) => {
    db.collection('games').findOne({ _id: new mongodb.ObjectID(req.params.id) }, (err, game) => {
      if (err) {
        res.status(500).json({ errors: { global: err } })
      } else {
        res.json({ game })
      }
    })
  })

  app.put(`/api/games/:id`, (req, res) => {
    const { errors, isValid } = validate(req.body)
    if (isValid) {
      const { title, cover } = req.body
      db.collection('games').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params._id) },
        { $set: { title, cover } },
        { returnOriginal: false },
        (err, result) => {
          console.log(err)
          if (err) {
            res.status(500).json({ errors: { global: err } })
            return
          }
          console.dir(result)
          res.json({ game: result.value })
        }
      )
    } else {
      res.status(400).json({ errors })
    }
  })

  app.use((req, res) => {
    res.status(404).json({
      errors: {
        global: 'Still working on it. Please try again later than when we implement it'
      }
    })
  })
})


app.listen(4000, console.log('server running on localhost:4000'))