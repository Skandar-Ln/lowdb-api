const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /posts/:id
    app.get('/:project/:key', (req, res) => {
      const post = db.get(req.params.project)
        .value()[req.params.key]

      res.send(post)
    })

    // POST /posts
    app.post('/:project/:key', (req, res) => {
        console.log('req', req);
      db.set(`${req.params.project}.${req.params.key}`, req.body)
        .write()
        .then(post => res.send(post))
    })

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.listen(3000, () => console.log('listening on port 3000'))
  });
  