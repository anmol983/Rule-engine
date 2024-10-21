import express from 'express';
import {createRule,combineRules,evaluateRule} from '../controllers/ruleController.js';

const router = express.Router();

router.post('/create_rule', createRule);
router.post('/combine_rules', combineRules);
router.post('/evaluate_rule', evaluateRule);

export default router;
