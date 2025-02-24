const express = require('express');
const { createResourceVisit, getResourceVisits, getVisitsByResource, getVisitsByUser } = require('../controllers/resourceVisitController');

const router = express.Router();

router.post('/resource-visits', createResourceVisit);
router.get('/resource-visits', getResourceVisits);
router.get('/resource-visits/resource/:resourceId', getVisitsByResource);
router.get('/resource-visits/user/:userId', getVisitsByUser);

module.exports = router;
