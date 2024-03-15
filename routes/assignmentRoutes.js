const express = require('express');
const assignmentController = require('./../controllers/assignmentController');

const router = express.Router();

router
  .route('/')
  .get(assignmentController.getAllAssignment)
  .post(assignmentController.addAssignment);

router
  .route('/:assignmentId')
  .get(assignmentController.getAssignment);

router
  .route('/validate/:assignmentId')
  .post(assignmentController.validateAssignment);

module.exports = router;
