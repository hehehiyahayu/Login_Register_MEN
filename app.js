const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const bodyParser = require("body-parser")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const User = require("./models/user")

// mongoose.set("useNewUrlParser", true)
// mongoose.set("useFindAndModify", false)
// mongoose.set("useCreateIndex", true)
// mongoose.set("useUnifiedTopology", true)
mongoose.connect("mongodb://localhost:27017/users").then(() => {
    console.log("connected to database");
})

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser)

//Routes
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/secret", isLoggedIn,(req, res) => {
    res.render("secret");
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    User.register(new User({username: username}), password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("register")(
            req, res, () => {
                res.render("secret");
        })
    })
})

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {

})

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Has Started in ${port}`);
})
