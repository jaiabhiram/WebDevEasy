const { JSDOM } = require("jsdom");
const HTMLHint = require('htmlhint').HTMLHint;
const Assignment = require('./models/assignmentModel');

function validateHtml(html, criteria) {
  let results = [];
  // Basic Validation checks
  const basicHTMLchecks = HTMLHint.verify(html);
  const dom = new JSDOM(html);
  const document = dom.window.document;
  

  function checkCriteria(selector, message, context = document, notEmpty = false) {
    if (!context) {
        results.push({status:'Failed', message: message});
      return;
    }
    const elements = context.querySelectorAll(selector);
    if (elements.length === 0) {
        results.push({status:'Failed', message: message});
    } else if (notEmpty) {
      const nonEmptyElements = Array.from(elements).filter(el => el.textContent.trim() !== '');
      if (nonEmptyElements.length === 0) {
        results.push({status:'Failed', message: message});
      } else {
        results.push({status:'Passed', message: message});
      }
    } else {
        results.push({status:'Passed', message: message});
    }
  }

  // validation process starts here
  criteria.forEach(criterion => {
    checkCriteria(criterion.selector, criterion.message);

    if (criterion.contains && criterion.contains.length) {
      criterion.contains.forEach(containedCriterion => {
        checkCriteria(containedCriterion.selector, containedCriterion.message, document.querySelector(criterion.selector), containedCriterion.notEmpty);
      });
    }
  });

  return results;
}

async function provideFeedbackcode(html, assignmentId) 
{   
  try{
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
          return [{ status: 'Failed', message: 'Assignment not found.' }];
      }
      const validationResults = validateHtml(html, assignment.criteria);
      return validationResults;
  } catch (error) {
      console.error('Error fetching assignment:', error);
      return [{ status: 'Failed', message: 'Error fetching assignment data.' }];
  }
}

exports.provideFeedback = provideFeedbackcode;
exports.validateHtml = validateHtml;