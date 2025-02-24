const express = require('express');
const { createResourceUpdate, getResourceUpdates, getUpdatesByResource } = require('../controllers/resourceUpdateController');

const router = express.Router();

router.post('/resource-updates', createResourceUpdate);
router.get('/resource-updates', getResourceUpdates);
router.get('/resource-updates/resource/:resourceId', getUpdatesByResource);

module.exports = router;
