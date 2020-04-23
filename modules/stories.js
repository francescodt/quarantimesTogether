'use strict';
const handleError = require('./error');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

function showStories(req,res) {
    client.query('SELECT * FROM stories ORDER BY id DESC;').then(stories => {
      res.render('pages/stories',{stories:stories.rows});
    }).catch(err =>
        handleError(err, req, res));
  }

  module.exports = showStories;