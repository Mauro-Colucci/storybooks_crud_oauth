const router = require('express').Router()
const passport = require('passport')


// auth with google
//get /auth/google

router.get('/google', passport.authenticate('google', {scope: ['profile']}))

//google auth callback
//get /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res)=>{
    res.redirect('/dashboard')
})

//logout user
//get /auth/logout
router.get('/logout', (req, res)=>{
    req.logout(err => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

module.exports = router

