var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
var passport = require('passport');
const localStratagey = require('passport-local')
passport.use(new localStratagey(userModel.authenticate()));
const upload = require('./multer')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
});

router.get('/login', function (req, res, next) {
  res.render('login',({error:req.flash('error')}))
});

router.get('/feed', function (req, res, next) {
  res.render('feed')
});

// upload router for upload post 
router.post('/upload',isLoggedIN,upload.single('file'),async(req,res)=>{
  if(!req.file){
    return res.status(404).send("N0 such file uploded")
  }

  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    imageText:req.body.imageText,
    image:req.file.filename,
    userId : user._id
  })
   user.post_id.push(post._id)
  await user.save();
  res.redirect('/profile')
})

// profile page : protected route
router.get('/profile',isLoggedIN,async(req,res,next)=>{
  const user = await userModel.findOne({
    username:req.session.passport.user
  }).populate('post_id')

  res.render("profile", {user})
})




// register a user
router.post('/register',(req,res)=>{
  const {username,email,fullname} = req.body;
  const userData = new userModel({username,email,fullname});

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
})

// login a user
router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}),(req,res)=>{})


// logout a user
router.get('/logout',(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// middleware for protected routes
function isLoggedIN(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect('/login');
}























// router.get('/createuser', async function (req, res, next) {
//   const createduser = await userModel.create({
//     username:'harsh',
//     password:'harsh',
//     post:[],
//     fullName:'harshpatil',
//     email:'harshpatil@gmail.com'
//   });
//   res.send(createduser);

// })


//   router.get('/createpost',async function (req, res, next) {
//       const createdPost = await postModel.create({
//       postText: "hello ji all",
//       userId: "66b615c041b28d8456285609"
//       })
//       const user = await userModel.findOne({_id:"66b615c041b28d8456285609"})
//       user.post_id.push(createdPost._id);
//       user.save();
//       res.send(createdPost)
//   });

//   router.get('/users', async function(req,res){
//     const user = await userModel.findOne({_id:"66b615c041b28d8456285609"}).populate("post_id")
//     res.send(user);
//   })

  


  module.exports = router;

  