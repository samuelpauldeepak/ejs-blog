//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const homeStartingContent = "Welcome Folks this is Samuel Paul Deepak, This application create with the purpose of share the induvidual content in textical form in ther post. TO SHARE YOUR THOUGHTS- In the url you have to type (url/compose) to open the secret Compose page you can share your post, by add your name in titleBox and put the content in contentbox";
const compose_content = "Example: spd-personalblog.herokuapp.com/compose"
const aboutContent = "This is a Personal Blog or Personal journal Web app, Designed and Deployed by Samuel Paul Deepak You Can Put you own Blog in this journal.";
const contactContent = "For further querys Just Mail @ spdgroups@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_DB_URL).then(console.log("connection Succeeded in MongoDB")).catch(err => {console.log(err)});

const postSchema = new mongoose.Schema({
  title :{
    type: String,
    required: true
  },
  content:{
    type: String,
    required: true
  }
});

const Post = mongoose.model('post', postSchema);



let posts = [];
app.get("/", function(req,res){
  Post.find({},function(err , posts){
      res.render('home', {Content: homeStartingContent,compose_content:compose_content, postData : posts});
  });


});

app.get("/about", function(req,res){
  res.render('about', {Content: aboutContent});
});

app.get("/contact", function(req,res){
  res.render('contact', {Content: contactContent});
});

app.get("/compose", function(req,res){
  res.render('compose');
});


app.post("/compose", function(req, res){

    postTitle = req.body.postTitle;
    postBody = req.body.postBody;

  const post = new Post({
    title : postTitle,
    content:postBody
  });
  post.save(function(err){
    if(!err){
       res.redirect("/");
    }
  });



});



app.get("/post/:route",function(req,res){
const id = req.params.route;
Post.findOne({_id:id},function(err,post){
  res.render("post", {Title:post.title, Content:post.content});
});

});








app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
