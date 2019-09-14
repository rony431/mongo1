const express = require('express')
var mongoose = require("mongoose");
const app = express()

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

mongoose.connection.on("error", function(e){console.error(e)})
var schema = mongoose.Schema({
    name: { type: String, default:"Anónimo"},
    date: { type: Date, default: Date.now() },
  });
          // definimos el modelo
 var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {

    Visitor.create({ name: req.query.name}, function(err) {
      if (err) return console.error(err);
    });
  res.send("<h1>El visitante fue almacenado con éxito</h1>")
});
app.listen(3000, () => console.log('Listening on port 3000!'));