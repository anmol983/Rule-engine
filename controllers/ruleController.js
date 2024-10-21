import Rule from '../models/Rule.js';
import { parseRuleString, combineNodes, evaluate, printTree } from '../utils/ast.js';

function generateRandomLetterString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const createRule = async (req, res) => {
  try {
    const { ruleName, ruleString } = req.body;
    if (!ruleName || !ruleString) {
      return res.status(400).json({ error: 'ruleName and ruleString are required' });
    }
    const rootNode = parseRuleString(ruleString);
    const rule = new Rule({ ruleName, ruleAST: rootNode });
    await rule.save();
    printTree(rootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const combineRules = async (req, res) => {
  try {
    const { rules, op } = req.body;
    const ruleDocs = await Rule.find({ ruleName: { $in: rules } });
    if (ruleDocs.length === 0) {
      return res.status(404).json({ error: 'No matching rules found' });
    }
    const ruleASTs = ruleDocs.map(rule => rule.ruleAST);
    const combinedRootNode = combineNodes(ruleASTs, op);
    const randomString = generateRandomLetterString(4);
    const rule = new Rule({ ruleName: `combined${randomString}`, ruleAST: combinedRootNode });
    await rule.save();
    printTree(combinedRootNode);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const evaluateRule = async (req, res) => {
  try {
    const { ast, data } = req.body;
    const rule = await Rule.find({ ruleName: ast });

    if (!rule || rule.length === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    const result = evaluate(rule[0].ruleAST, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
