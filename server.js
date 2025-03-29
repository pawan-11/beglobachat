const express = require('express'); // Importing express
const mongoose = require('mongoose');
const app = express(); // Creating an express app
const bodyParser = require('body-parser');
var cors = require('cors');
var allowlist = ['http://localhost:3000/*', 'https://globaletter.web.app/*'];

const username = encodeURIComponent("pawaneleven");
const password = encodeURIComponent("prabh610");
const cluster = encodeURIComponent("globachat");
//mongoose.connect('mongodb://localhost:27017/letters');
mongoose.connect(`mongodb+srv://${username}:${password}@globachat.9oafhsz.mongodb.net/?retryWrites=true&w=majority&appName=globachat`);
const conSuccess = mongoose.connection
conSuccess.once('open', _ => {
  console.log('Database connected:')
})

conSuccess.on('error', err => {
  console.error('connection error:', err)
})

const LetterSchema = new mongoose.Schema({
  from: String,
  to: String,
  msg: String,
  date: Date,
});
const Letter = mongoose.model("Letter", LetterSchema);

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors())
app.use(bodyParser.json());
// Create a route that sends a response when visiting the homepage
app.post('/send/',  async (req, res) => {
  try {
    console.log("got chu", req.body );
    const ltr = new Letter({'from': req.body.from, 'to':req.body.to, 'msg':req.body.msg});
    ltr.save();
    res.send("Suckcess");
  }
  catch (err) {
    console.log("error sending letter from ",req.body.from,"to",req.body.to);
  }
});

app.delete('/delete/', async (req, res)=> {
  try {
    console.log('at delete', req.query.id)
    let x = await Letter.deleteOne({_id:req.query.id})
    res.json({});
  }
  catch (err) {
    console.log("error deleting letter with id",req.query.id,"\nerr:",err)
  }
  return;
});

app.get('/getletters/',  async (req, res) => { //get letters sent to {req.query.to}
  try {
    console.log("get ltr from ", req.query.to);
    let ltrs = await Letter.find({ to:req.query.to });
    console.log("sending getleterrs:",ltrs);
    res.json(ltrs);
  }
  catch (err) {
    console.log("error getting letters")
  }
});

// Set up the server to listen on port 3001
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
