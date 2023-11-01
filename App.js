const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path")
const { mongoose } = require("mongoose");
const userRoutes = require("./Routes/User");
const authRoutes = require("./Routes/Auth");
const productRoutes = require("./Routes/Product");
const orderRoutes = require("./Routes/Order");
const categoryRoutes = require("./Routes/Category");
const cartRoutes = require("./Routes/Cart");
const recycle_product_route = require("./Routes/recycle");
const stripeRoutes = require("./Routes/stripepayment");
const cors = require("cors");
const formidable = require("formidable")
const fs = require("fs")
app.use(cors());
dotenv.config();

app.use('/public', express.static(path.join(__dirname, 'public')))

mongoose.set('strictQuery', false);
// Database  Connection
mongoose
  .connect(process.env.Localhost)
  .then(() => {
    console.log("Db connection successfully.");
  })
  .catch(err => {
    console.log("Db connection error.", err);
  });

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", categoryRoutes);
app.use("/api", recycle_product_route);
app.use("/api", stripeRoutes);


// app.post('/api/upload', (req, res, next) => {
 
//   const form = new formidable.IncomingForm();
//   form.parse(req, function (err, fields, files) {
//        for (const iterator of files.image) {
//          let oldPath = iterator.filepath;
//          let newPath = path.join(__dirname, 'public')
//              + '/' + iterator.originalFilename
//          let rawData = fs.readFileSync(oldPath)
   
//          fs.writeFile(newPath, rawData, function (err) {
//              if (err) console.log(err)
//              return res.send("Successfully uploaded")
//          })
//        }
//   })
// });
// Server response port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on\nhttp://localhost:${port}`);
});
