const router = require('express').Router()
const { ensureAuth } = require('../midelware/auth')

const Story = require('../models/Story')

//show add page
//get /stories/add

router.get('/add', ensureAuth, (req, res)=>{
    res.render('stories/add')
})

//process add form
//post /stories

router.post('/', ensureAuth, async(req, res)=>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//show all stories 
//get /stories/

router.get('/', ensureAuth, async(req, res)=>{
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//show single story
//get /stories/:id

router.get('/:id', ensureAuth, async(req, res)=>{
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

//show edit page
//get /stories/edit/:id

router.get('/edit/:id', ensureAuth, async(req, res)=>{
    try {
        const story = await Story.findById(req.params.id).lean()

        if(!story) {
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//update story
//put /stories/:id

router.put('/:id', ensureAuth, async(req, res)=>{
    try {
        let story = await Story.findById(req.params.id).lean()
        if(!story){
            return res.render('error/404')
        }
        if(story.user != req.user.id){
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
        res.redirect('/dashboard')
    }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }   
})

//delete story
//delete /stories/:id

router.delete('/:id', ensureAuth, async(req, res)=>{
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//show user stories
//get /stories/user/:userId

router.get('/user/:userId', ensureAuth, async(req, res)=>{
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router