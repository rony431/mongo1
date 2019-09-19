const express = require('express')
var mongoose = require("mongoose");
const app = express()

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

mongoose.connection.on("error", function(e){console.error(e)})
var schema = mongoose.Schema({
  name: { type: String, default:"Anónimo"},
  count: { type: Number, default: 1 },
});
// definimos el modelo
var Visitor = mongoose.model("Visitor", schema);
var initialHeader = "<html><table><thead><tr><th>Id</th><th>Name</th><th>Visits</th></tr></thead>";
var finalCloser = "</table></html>"
app.get('/', (req, res) => {
 
  let nombre = "";
  if (req.query.name||req.query.name != null){
     nombre = req.query.name
  }else{
     nombre = "Anónimo" 
  } 
  Visitor.findOne({ name: nombre }, function(err, visitor) {
    if (err) return console.error(err)
      if(visitor){  
        visitor.count += 1;
        visitor.save(function(err) {
          if (err) return console.error(err);
          Visitor.find(function(err, visitors) {
            if (err) return console.error(err);
            var result = '';
            for (let i =0; i < visitors.length; i++){
               result = result + "<tr><td>"+visitors[i]._id+"</td><td>"+visitors[i].name+"</td><td>"+visitors[i].count+"</td></tr>"
            }
            res.send(initialHeader+result+finalCloser)
          });  
        });
      }else{
        Visitor.create({ name: nombre}, function(err) {
           if (err) return console.error(err);
          Visitor.find(function(err, visitors) {
            if (err) return console.error(err);
            var result= "";
            for (let i =0; i < visitors.length; i++){
               result = result + "<tr><td>"+visitors[i]._id+"</td><td>"+visitors[i].name+"</td><td>"+visitors[i].count+"</td></tr>"
            }
            res.send(initialHeader+result+finalCloser)
          });  
        });
      }
    }); 
});

app.listen(3000, () => console.log('Listening on port 3000!'));


