const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkAuthenticationCookie } = require("./middlewares/authentication");
// Importing the user route
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/blogify").then(e => console.log("Connected to MongoDB"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));

app.set('view engine' , 'ejs');
app.set('views' , path.resolve('./views'));

app.get("/", (req, res) => {
    res.render("home" , {
        user : req.user,
    });
});

app.use('/user' , userRoute);

app.listen(PORT , () => console.log(`Server started at port:${PORT}`))