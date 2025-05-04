const https = require("https");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
//const cors = require("cors");
const config = require("./config");  // Import our config
const gamesRoute = require('./routes/games');
const ratingRoutes = require("./routes/rating");
const userRoutes = require('./routes/users');
//const Game = require("./models/Game");
//const User = require("./models/User");

const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

// Manuel CORS yapılandırması
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/', (req, res) => {
  res.send('Server Çalışıyor!');
});

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/games', gamesRoute);

app.use("/api/rate", ratingRoutes);




// MongoDB bağlantısı
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

  app.get('/', (req, res) => {
    res.send('BludyClud Server Başarıyla Çalışıyor!');
  }); 
// Rotalar

app.use("/api/games", gamesRoute);
// HTTPS sunucusunu başlat
const httpsOptions = {
  key: fs.readFileSync("key.pem"), // Özel anahtar dosyası
  cert: fs.readFileSync("cert.pem"), // Sertifika dosyası
};

https.createServer(httpsOptions, app).listen(config.port, () => {
  console.log(`Server running on https://localhost:${config.port}`);
});

