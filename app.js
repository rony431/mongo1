const express = require('express')
var mongoose = require("mongoose");
var bcrypt = require('bcrypt')
var cookieSession = require('cookie-session')
const app = express()
app.set('view engine', 'pug');
app.set('views', 'views');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

mongoose.connection.on("error", function(e){console.error(e)})
var schema = mongoose.Schema({
  name: { type: String, required:true},
  email: { type: String, required:true},
  password: {type:String, required:true}

});
// definimos el modelo
var Visitor = mongoose.model("Visitor", schema);
var rows= '';
app.use(express.urlencoded())
app.use(cookieSession({
  secret: 'prueba',
  maxAge: 24 * 60 * 60 * 1000
}));
app.get('/', (req, res) => {
  if(!req.session.userId){
    res.redirect('/login')
  }
  Visitor.find(function(err, visitors) {
    if (err) return console.error(err);
    res.render('table_home',{visitors: visitors});  
  }); 

});
app.get('/login', (req, res) => {
  res.render('table_login');
});
app.get('/register', (req, res) => {
  res.render('index');
});
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/')
});
app.post('/login', (req, res) => {
  const emailFormLogin = req.body.email
  const passFormLogin = req.body.password
  
  Visitor.findOne({ "email": emailFormLogin }, function(err, visitor) {
    if (err) return console.error(err);
    bcrypt.compare(passFormLogin, visitor.password).then(function(res){
    req.session.userId = visitor._id; 
    res.redirect('/') 
    });
  });
  
})
app.post('/register', (req, res) => {
  const nameForm = req.body.username
  const emailForm = req.body.email
  const passForm = req.body.password
  bcrypt.hash(passForm,10).then(function(hash){
    Visitor.create({ name: nameForm, email: emailForm, password:hash }, function(err) {
      if (err) return console.error(err);
    });
  });
  res.redirect('/')
})




app.listen(3000, () => console.log('Listening on port 3000!'));


