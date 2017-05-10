
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Schema
const {Posts} = require('./models/posts');


const app = express();

// Get Section
router.get('/', async (req, res) => {
//     Posts
//     .find()
//     .exec()
//     .then(data => {
//       res.status(200).json(data);
//     });
  let data = await Posts.find().exec();
  res.status(200).json(data);
});

// Post Section
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Posts
    .create({
      title: req.body.title,
      content: req.body.content,
      author: {
        firstName: req.body.author.firstName,
        lastName: req.body.author.lastName
      }
    })
    .then(
      data => res.status(201).json(data))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});


// Delete Section
// router.delete('/:id', (req, res) => {
//   BlogPosts.delete(req.params.id);
//   console.log(`Deleted rsBlog Post item \`${req.params.id}\``);
//   res.status(204).end();
// });

router.delete('/:id', (req, res) => {
  Posts
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});


// Put Section
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body._id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body._id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);

  const toUpdate = {author:{}};
  const updateableFields = ['title', 'content'];
  const authorUpdateableFields = ['lastName', 'firstName'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  authorUpdateableFields.forEach(field => {
    if (field in req.body.author) {
      toUpdate.author[field] = req.body.author[field];
    }
  });

  Posts
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(data => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;