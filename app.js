const express = require('express')
var mongoose = require("mongoose");
const app = express()
app.set('view engine', 'pug');
app.set('views', 'views');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

mongoose.connection.on("error", function(e){console.error(e)})
var schema = mongoose.Schema({
  name: { type: String, required:true},
  email: { type: String, required:true},

});
// definimos el modelo
var Visitor = mongoose.model("Visitor", schema);
var rows= '';
app.get('/', (req, res) => {
  Visitor.find(function(err, visitors) {
    if (err) return console.error(err);
    res.render('table_home',{visitors: visitors});  
  }); 
});
app.get('/register', (req, res) => {
  res.render('index');
 
});
app.use(express.urlencoded())
app.post('/register', (req, res) => {
  const nameForm = req.body.username
  const emailForm = req.body.email

  Visitor.create({ name: nameForm, email: emailForm }, function(err) {
    if (err) return console.error(err);
  });
  res.redirect('/')
})




app.listen(3000, () => console.log('Listening on port 3000!'));


