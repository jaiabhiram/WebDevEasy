const Assignment = require('../models/assignmentModel');
const validator = require('../validatorlogic');

exports.addAssignment = async (req, res) => {
    try {
      console.log('I am triggered');
      validator.validateHtml(``,req.body.criteria);
      const newAssignment = await Assignment.create(req.body);
      res.status(200).json({
        status: 'success',
        data: {
          assignment: newAssignment
        }
      });
    } catch (err) {
      let errorMessage = err.toString().split('\n')[0];
      // console.log(errorMessage);
      res.status(404).json({
        status: 'Failure',
        data: {
          message: errorMessage
        }
      });
    }
  };
  
  exports.getAllAssignment = async (req, res) => {
    try {
      const assignments = await Assignment.find({}).select('-criteria -__v');
      res.status(200).json({
        status: 'success',
        data: {
          assignments: assignments
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'Failure',
        data: {
          message: err
        }   
      });
    }
  };

  exports.getAssignment = async (req, res) => {
    try {
      console.log(req.params.assignmentId);
      const assignmentId = req.params.assignmentId.replace(/['"]+/g, '').trim();
      const assignment = await Assignment.findById(assignmentId).select('-criteria -__v');

      if (!assignment) {
        return res.status(404).json({
            status: 'Failure',
            data: {
                message: 'Assignment not Found'
            }
          });
      }
      res.status(200).json({
        status: 'success',
        data: {
          assignment: assignment
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'Failure',
        data: {
          message: err
        }
      });
    }
  };

  exports.validateAssignment = async (req, res) => {
    const assignmentId = req.params.assignmentId.replace(/['"]+/g, '').trim();
    var ans = await validator.provideFeedback(req.body.jscode, assignmentId);
    res.send(ans);
  };