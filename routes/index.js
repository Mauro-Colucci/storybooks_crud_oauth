const router = require('express').Router()
const {ensureAuth, ensureGuest} = require('../midelware/auth')

const Story = require('../models/Story')

//login/landing
//get /

router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {
        layout: 'login'
    })
})

//dashboard
//get /dashboard

router.get('/dashboard', ensureAuth, async(req, res)=>{
    try {
        //lean transform the mongodb obj to a js obj
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
   
})

module.exports = router