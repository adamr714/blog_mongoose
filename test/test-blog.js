const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });
  it('should get a list of blogs on GET', function() {
      return chai.request(app)
      .get('/blog-posts/')
      .then(function(res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        res.body.should.have.length.of.at.least(1);

        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys('title', 'content', 'author');
        });
      });
  });

  it('should add a blog on POST', function() {
    const newBlog = {
        title: "Order 66", content: "Eliminate All Jedi", author: "Emperor"
    };
    return chai.request(app)
      .post('/blog-posts/')
      .send(newBlog)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content' ,'author');
        res.body.title.should.equal(newBlog.title);
        res.body.content.should.equal(newBlog.content);
        res.body.author.should.equal(newBlog.author);
      });
  });

  it('should update recipes on PUT', function() {
    const updateData = {
      title: 'Order 66',
      content: 'Eliminate Yoda',
      author: "Darth Sidious"
    };

    return chai.request(app)
      .get('/blog-posts/')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        // res.body.should.include.keys('title', 'contnet', 'author');
        res.body.title.should.equal(updateData.title);
        res.body.content.should.equal(updateData.content);
        res.body.author.should.equal(updateData.author);
      });
  });


  it('should delete blog on DELETE', function() {
    return chai.request(app)
      // first have to get recipes so have `id` for one we want
      // to delete. Note that once we're working with databases later
      // in this course, we'll be able get the `id` of an existing instance
      // directly from the database, which will allow us to isolate the DELETE
      // logic under test from our GET interface
      .get('/blog-posts/')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});


  


