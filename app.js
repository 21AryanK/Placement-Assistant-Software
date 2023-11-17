const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// MongoDB connection URL
const mongoURL= 'mongodb+srv://admin-aryan:P36l69Y9Njq0ekAc@cluster0.ca3e4px.mongodb.net/placementAss';

// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })

.then(async () => {
    console.log('Connected to MongoDB');

    const app = express();

    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static("public"));

    //Schema
    const placeSchema= new mongoose.Schema({
        email: String,
        password: String,
    });

    //Model
    const Place= mongoose.model("PlacementCell",placeSchema);

    app.get("/", function(req, res){
        res.render("home");
    });

    app.get("/login", function(req, res){
        res.render("login");
    });

    app.get("/register", function(req, res){
        res.render("register");
    });

    app.get("/mainPage",function(req,res){
        res.render("ui");
    })

    app.get("/details", function(req,res){
        res.render("add");
    })

    app.get("/feedback", function(req, res){
        res.render("feed");
    })

    app.get("/sucessfull", function(req,res){
        res.render("success");
    })

    app.get("/logout", (req, res) => {
        // clear the cookie
        res.clearCookie("username");
        // redirect to login
        return res.redirect("/login");
    });

    app.post("/register", function(req,res){
        const post= new Place({
          email: req.body.username,
          password: req.body.password
        });
        post.save();
        res.redirect("/");
      });

    
    app.post("/login", async (req, res) => {
    let { username, password } = req.body;
    const user = await Place.findOne({ email: username }).lean()
    if (!user) {
        res.status(404).send({message: "No  User Found"})
    } else {

        var validatePassword = await bcrypt.compare(password, user.password)

        if (!validatePassword) {
            res.redirect("/mainPage");
        } else {
        res.cookie("username", username, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: 'lax'
        });

        }
    }
});
    
    app.listen(3000, function() {
        console.log("Server started on port 3000");
      });
  })
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
