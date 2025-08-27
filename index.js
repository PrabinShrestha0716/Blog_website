import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
const port = 3000;
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));



// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });


const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});


let posts = [];

app.get("/posts", (req, res) => {
  res.render("posts");
});




app.post('/posts', upload.single('image'), (req, res) => {

  console.log('req.file:', req.file);  

  const { author, body } = req.body;
   const imagePath = req.file ? '/uploads/' + req.file.filename : null;

  const newPost = {
    id: Date.now().toString(),
    author: (author || "").trim(),
    body: (body || "").trim(),
    image: imagePath,
    createdAt: Date.now()
  };

  posts.push(newPost);
  res.redirect("/");  // redirect back to posts page
});


app.listen(port,() =>{
console.log(`Server is running on ${port}.`)


});