var PORT = 3000;
var express = require('express');
console.log('express acquired');
var request = require('request');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'vendor')));

//body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
console.log("Post Service Acquired")

const _ = require("lodash")

//Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hackathon', { useNewUrlParser: true });
console.log("Database Created");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userschema = new Schema({

  first: String,
  last: String,
  email: String,
  phone: String,
  type: String,
  pass: String,
});

const usermodel = mongoose.model("user", userschema);

const codeschema = new Schema({

  code:String,
  type:String,
});

const codemodel=mongoose.model('code',codeschema);

app.get('/', function (req, res) {
  res.render("index");
});

app.get('/contact', (req, res) => {
  res.render("contact");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get('/causes', (req, res) => {
  res.render("causes");
});

app.get('/facts', (req, res) => {
  res.render("facts");
});

app.get('/login', (req, res) => {
  res.render('login', { mesg: null })
})

app.post('/login', (req, res) => {
  if (req.body.submit) {
    let a = req.body.email
    let b = req.body.pass
    let c = req.body.subject
    usermodel.findOne({ email: a, pass: b, }, function (err, doc) {
      console.log(doc)
      if (err) {
        console.log(err, 'error')
        res.render('login', { mesg: "An Error Occurred, Please try again after some time." })
        return
      }
      if (_.isEmpty(doc)) {
        res.render('login', { mesg: "Please check email/password" })
      } else {
        res.redirect('/scanner/'+doc.email)
      }
    })
  }
})

app.get('/register', (req, res) => {
  res.render('signup')
})

app.post('/register', (req, res) => {
  console.log(req.body);
  if (req.body.submit) {
    let newuser = new usermodel()
    newuser.first = req.body.first_name
    newuser.last = req.body.last_name
    newuser.email = req.body.email
    newuser.phone = req.body.phone
    newuser.type = req.body.subject
    newuser.pass = req.body.pass
    newuser.save(function (err) {
      if (err) {
        console.log(err)
        return
      }
      else {
        res.redirect('/login')
      }
    });
  }
})

app.get('/scanner/:doc', (req, res) => {
  let a= req.params.doc
  usermodel.find({email:a}, function(err,docs){
    if(err){
      console.log(error)
    }
    else{
      console.log(docs)
    }
  })
})

app.post('/scanner/:doc',(req,res)=>{
  let b= req.params.doc
  usermodel.find({email:a}, function(err,docs){
    if(err){
      console.log(error)
    }
    else{
      global.a=docs
      console.log(docs)
    }
  })
  if(req.body.submit){
    let newcode=new codemodel()
    newcode.type=req.body.user
    newcode.code=req.body.code
    codemodel.find({code:req.body.code}, function(err,doces){
      if(err){
        console.log(err)
      }
      else if(_.isEmpty(doces)){
        newcode.save(function (err) {
          if (err) {
            console.log(err)
            return
          }
          else {
            res.redirect('/scanner/'+ b)
          }
        });
      }
      else{
        console.log("Code Exist")
      }
    })
  }
})

app.listen(PORT, (req, res) => {
  console.log('App on 3000');
});