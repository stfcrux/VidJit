const express = require('express');

const router = express.Router();
//list videos belonging to current logged in user
router.get('/listVideos', (req,res)=> {

    res.render('video/listVideos', { //pass object to list Videos.handlebar
        videos:'List of videos'
    });
});


router.get('/showAddVideo', (req,res)=>{
    res.render('video/addVideo');

});
module.exports = router;
