const express = require("express");
const router = express.Router();
const jwt = require('jwt-simple');
const db = require('../models');
const bcrypt = require('bcryptjs');

const secrets = require('../secrets');

const passport = require('passport');

router.use(passport.initialize());

require('../auth/passAuth')

let requireLogin = passport.authenticate('local', {session: false})
let requireJwt = passport.authenticate('jwt', {session: false})

router.use(express.urlencoded({extended: false})) // scrape email and pwd frm request header 
router.use(express.json())  //req.body

const token = (userRecord) => {
    
    let timestamp = new Date().getTime();

    return jwt.encode({sub: userRecord.id, iat: timestamp}, secrets.secrets)

}

router.get('/', (req, res) => {

    res.send('home page')

})

router.post('/register', async (req, res) => {

    let {email, password} = req.body;

    try {

        let records = await db.users.findAll({where: {email}})

        if(records.length === 0){

            password = bcrypt.hashSync(password, 8)

            let newUserRecord = await db.users.create({email, password})

            let jwtToken = token(newUserRecord)

            return res.json({token: jwtToken})

        }
        else{

            return res.status(422).json({error: "This e-mail already exists"})

        }
    }
    catch(err){

        return res.status(423).json({error: "Cannot access database"})
        
    }
})

router.post('/login', requireLogin, (req, res) => {

    res.json({token: token(req.user)})

})

router.get('/protected', requireJwt, (req, res)=>{

    console.log('Passed protected page')

    res.json({isValid: true})
    
})

module.exports = router;