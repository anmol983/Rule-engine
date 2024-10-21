import mongoose from 'mongoose';

const { Schema } = mongoose;

const ruleSchema = new Schema({
  ruleName: { type: String, required: true, unique: true },
  ruleAST: { type: Object, required: true }
});

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;
