'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
//npm modules
const expect = require('expect');
const superagent = require('superagent');
// app modules
const Hero = require('../model/hero.js');
const server = require('../lib/server.js');

let tempHero;
const API_URL = process.env.API_URL;

describe('testing hero router', () => {
  before(server.start);
  after(server.stop);

  describe('testing GET /api/heros/:id', () => {
    var tempHero;

    afterEach(() => Hero.remove({}));
    beforeEach(() => {
      return new Hero({
        name: 'The Juicer',
        origin: 'The Kitchen',
        goodOrEvil: 'Evil',
      })
      .save()
      .then(hero => {
        tempHero = hero;
      });
    });
    it('should respond with a hero', () => {
      return superagent.get(`${API_URL}/api/heros/${tempHero._id}`)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempHero._id);
        expect(res.body.name).toEqual(tempHero.name);
        expect(res.body.origin).toEqual(tempHero.origin);
        expect(new Date(res.body.dateCreated)).toEqual(tempHero.dateCreated);
      });
    });
    it('should respond with a 404', () => {
      return superagent.get(`${API_URL}/api/heros/1234`)
      .catch(err => {
        expect(err.status).toEqual(404);
      });
    });
  });

  describe('testing POST /api/heros', () => {
    after(() => Hero.remove({}));
    let data = {name: 'Pickle Man', origin: 'A Jar', goodOrEvil: 'Evil'};
    it('should respond with a hero and 200 status', () => {
      return superagent.post(`${API_URL}/api/heros`)
      .send(data)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toExist();
        expect(res.body.name).toExist();
        expect(res.body.origin).toEqual('A Jar');
        expect(res.body.goodOrEvil).toEqual('Evil');
      });
    });
    it('should respond with a 400', () => {
      return superagent.post(`${API_URL}/api/heros`)
      .catch(res => {
        // expect(res.status).toEqual(200);
        expect(res.status).toEqual(400);
        // expect(res.body.name).toExist();
        // expect(res.body.origin).toEqual('A Jar');
        // expect(res.body.goodOrEvil).toEqual('Evil');
      });
    });
    it('should respond with a 409', () => {
      return superagent.post(`${API_URL}/api/heros`)
      .send(data).catch(res => {
        // expect(res.status).toEqual(200);
        expect(res.status).toEqual(409);
        // expect(res.body.name).toExist();
        // expect(res.body.origin).toEqual('A Jar');
        // expect(res.body.goodOrEvil).toEqual('Evil');
      });
    });
  });

  describe('testing PUT /api/heros/:id', () => {
    afterEach(() => Hero.remove({}));
    beforeEach(() => {
      return new Hero({
        name: 'Eyeball Man',
        origin: 'A Head',
        goodOrEvil: 'Good',
      })
      .save()
      .then(hero => {
        tempHero = hero;
      });
    });
    it('should respond with a hero', () => {
      return superagent.put(`${API_URL}/api/heros/${tempHero._id}`)
      .send({origin: 'A Hand',
        name: 'Fingerman',
        goodOrEvil: 'Evil'})
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempHero._id);
        expect(res.body.name).toEqual('Fingerman');
        expect(res.body.origin).toEqual('A Hand');
        expect(res.body.goodOrEvil).toEqual('Evil');
        expect(new Date(res.body.dateCreated)).toEqual(tempHero.dateCreated);
      });
    });
    it('should respond with 400', () => {
      return superagent.put(`${API_URL}/api/heros/${tempHero._id}`)
      .send({name: 1234})
      .catch(res => {
        expect(res.status).toEqual(400);
        expect(res.body._id).toEqual(tempHero._id);
      });
    });
    it('should respond with 400', () => {
      return superagent.put(`${API_URL}/api/heros/1234`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
  describe('testing DELETE /api/heros/:id', () => {
    afterEach(() => Hero.remove({}));
    beforeEach(() => {
      return new Hero({
        name: 'A Guy',
        origin: 'The Couch',
        goodOrEvil: 'Evil',
      })
      .save()
      .then(hero => {
        tempHero = hero;
      });
    });
    it('should delete a hero', () => {
      superagent.delete(`${API_URL}/api/heros/${tempHero._id}`)
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });
    it('should return 204', () => {
      superagent.delete(`${API_URL}/api/heros/1234`)
      .then(err => {
        expect(err.status).toEqual(204);
      });
    });
  });
});
