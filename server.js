import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import ruleRoutes from './routes/ruleRoutes.js'; // Add .js for ES module

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb+srv://anmolr444:anmol123@cluster0.wbdrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

// Serve static files from the public directory
app.use(express.static(path.join(path.resolve(), 'public')));

// Route for serving the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), './views/index.html'));
});

app.use('/api/rules', ruleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
