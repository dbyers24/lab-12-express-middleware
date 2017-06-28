'use strict';

const{Router} = require('express');
const jsonParser = require('body-parser').json();

//app modules

const Hero = require('../model/hero.js');

// module logic
const heroRouter = module.exports = new Router();

heroRouter.post('/api/heros', jsonParser, (req, res, next) => {
  console.log('POST /api/heros');

  new Hero(req.body)
  .save()
  .then(hero => res.json(hero))
  .catch(next);
});

heroRouter.get('/api/heros/:id', (req, res, next) => {
  console.log(' GET /api/heros:id');

  Hero.findById(req.params.id)
  .then(hero => res.json(hero))
  .catch(next);
});

heroRouter.put('/api/heros/:id', jsonParser, (req, res, next) => {
  console.log('PUT /api/heros');
  let options = {runValidators: true, new: true};

  Hero.findByIdAndUpdate(req.params.id, req.body, options)
    .then(hero => res.json(hero))
    .catch(next);
});

heroRouter.delete('/api/heros/:id', (req, res, next) => {
  console.log('DELETE /api/heros:id');

  Hero.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
