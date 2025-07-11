const path = require("path");
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const { checkAuthenticationCookie } = require("./middlewares/authentication");
// Importing the user route
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then(e => console.log("Connected to MongoDB"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public/')));

app.set('view engine' , 'ejs');
app.set('views' , path.resolve('./views'));

app.get("/", async(req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home" , {
        user : req.user,
        blogs : allBlogs,
    });
});

app.use('/user' , userRoute);
app.use('/blog' , blogRoute);

app.listen(PORT , () => console.log(`Server started at port:${PORT}`))