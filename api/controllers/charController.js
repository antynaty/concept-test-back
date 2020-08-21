const mongoose = require('mongoose');
const fetch = require('node-fetch');
// const axios = require('axios');

const Char = require('../models/charModel');

const url = 'http://localhost3030/';

exports.postChar = async (req, res) => {
  const page = req.query.page;
  var charsToInsert = [];
  var urlApi = '';
  const options = {
    method: 'GET',
  }

  if (req.query.page) {
    urlApi = `https://swapi.dev/api/people/?page=${page}`
  } else { urlApi = 'https://swapi.dev/api/people/' }

  console.log(urlApi);
  fetch(urlApi)
    .then(res => res.json())
    .then(json => {
      charsToInsert = json.results;
      console.log(charsToInsert)
      Char.insertMany(charsToInsert, function (err, docs) {
        if (err) { return res.status(409).json({ message: 'Error while insert', error: err }) }
        else { return res.status(200).json({ message: 'all docs people added' }) }
      });
    })
    .catch(err => res.status(400).json(err))
}

exports.getCharAll = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = (page) * limit;
  var charsHard = []
  try {
    charsHard = await Char.find().exec();
  } catch (error) {
    res.status(409).json(error)
  }
  
  const result = {};
  result.count = limit;
  if (endIndex < charsHard.length) {
    result.next = {
      page: page + 1,
      limit: limit
    }
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit
    }
  }
  result.resultUsers = charsHard.slice(startIndex, endIndex);

  res.json(result)
}

exports.getChar = async (req, res) => {

  // Char.findById(req.params.idChar)
  //   .exec()
  //   .then(char => {
  //     if (!char) { return res.status(404).json({ message: 'Char not found' }) }
      
  //     res.status(200).json({ message: 'Char found', data: char })
  //   })
  //   .catch(err => { res.status(500).json({ message: 'error', error: err }) })
  var char = {}
  try {
    char = await Char.findById(req.params.idChar).exec();
    console.log(char.homeworld);
    fetch(char.homeworld)
    .then(res => res.json())
    .then(json => {
      // charsToInsert = json.results;
      const finalResult = {
        name: char.name,
        height: char.height,
        gender: char.gender,
        homeworld: json.name,
        population: json.population
      }
      console.log(finalResult)
      return res.status(200).json(finalResult)
    })
    .catch(err => res.status(400).json(err))
  } catch (error) {
    res.status(500).json({ message: 'error', error: err })
  }
}