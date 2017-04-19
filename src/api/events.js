'use strict';

const express = require('express'),
      router = express.Router(),
      data = require('./events-data'),
      inspect = require('util').inspect,
      log = require('debug')('creation:api:events');

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(data);
});

router.get('/:id', (req, res, next) => {
  let id = +req.params.id;
  let event = data.find(event => event.id === id);
  log(event ?  `Found event for id: ${id}` : `Could not find event: ${id}`);
  if (!event) {
    let error = new Error('Not found');
    error.status = 404;
    return next(error);
  }

  res.json(event);
});

router.post('/', (req, res) => {
  log('Inserting new event.');
  const maxId = Math.max.apply(Math, data.map(event => event.id));
  req.body.id = maxId + 1;
  data.push(req.body);
  res.json(req.body);
});

router.put('/:id', (req, res) => {
  let id = +req.params.id;
  let eventIndex = data.findIndex(event => event.id === id);

  if (eventIndex === -1) {
    log('Inserting new event.');
    data.push(req.body);
  } else {
    log(`Replacing event at id: ${req.body.id}`);
    data.splice(eventIndex, 1, req.body);
  }

  res.json(req.body);
});

router.get('/sessions/search/', (req, res) => {
  const searchTerm = req.query.search.toLocaleLowerCase();
  let results = [];

  data.forEach(event => {
    const matchingSessions = event
      .sessions
      .filter(session => session.name.toLocaleLowerCase().includes(searchTerm))
      .map(session => {
        session.eventId = event.id;
        return session;
      });

    results = results.concat(matchingSessions);
  });

  res.json(results);
});

router.post('/:id/sessions/:sessionId/voters/:voterName', (req, res) => {
  let eventId = +req.params.id,
      sessionId = +req.params.sessionId,
      voterName = req.params.voterName;
  log({
    verb: 'POST',
    eventId: eventId,
    sessionId: sessionId,
    voterName: voterName,
  });

  let event = data.find(event => event.id === eventId);
  if (!event) {
    log('Could not find event');
    return res.sendStatus(404);
  }

  let session = event.sessions.find(session => session.id === sessionId);
  if (!session) {
    log('Could not find session');
    log(event);
    return res.sendStatus(404);
  }

  log(`Before POST: ${inspect(session)}`);
  if (!session.voters.some(voter => voter === voterName)) {
    session.voters.push(voterName);
    log(`After POST: ${session.voters}`);
  } else {
    log('Voter already added.');
  }

  return res.sendStatus(200);
});

router.delete('/:id/sessions/:sessionId/voters/:voterName', (req, res) => {
  let eventId = +req.params.id,
      sessionId = +req.params.sessionId,
      voterName = req.params.voterName;
  log({
    verb: 'DELETE',
    eventId: eventId,
    sessionId: sessionId,
    voterName: voterName
  });

  let event = data.find(event => event.id === eventId);
  if (!event) { return res.sendStatus(404); }

  let session = event.sessions.find(session => session.id === sessionId);
  if (!session) { return res.sendStatus(404); }

  let voterIndex = session.voters.findIndex(voter => voter === voterName);
  if (voterIndex > -1) {
    log(`Before DELETE: ${session.voters}`);
    session.voters.splice(voterIndex, 1);
    log(`After DELETE: ${session.voters}`);
    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

module.exports = router;
