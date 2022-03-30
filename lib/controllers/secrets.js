const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
    //   const secrets = [
    //     {
    //       id: '1',
    //       title: 'Operation Northwoods',
    //       description: 'Commit false flag attacks on US soil to drum up support to invade Cuba.',
    //       created_at: '???'
    //     },
    //   ];
      const secrets = await Secret.getAll();

      res.send(secrets);
    } catch (error) {
      next(error);
    }
  });
