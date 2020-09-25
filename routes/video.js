const express = require('express');
const router = express.Router();
const moment = require('moment');
const Video = require('../models/Video');
const ensureAuthenticated = require('../helpers/auth');
const alertMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)){  // checking if the folder exists, else make the directory based on user ID
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }
    
    upload(req, res, (err) => {
        if (err) {
            res.json({file: '/img/no-image.jpg', err: err});
        } else {
            if (req.file === undefined) {
                res.json({file: '/img/no-image.jpg', err: err});
            } else {
                res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
            }
        }
    });
})


//list videos belonging to current logged in user
router.get('/listVideos',ensureAuthenticated, (req, res)=>{
    // retrieve all the videos where the user id matches the given user id
    Video.findAll({
        where:{
            userId:req.user.id
        },
        // sorted by title in ascending order
        order:[
            ['title','ASC']
        ],
        // raw data set
        raw:true
    })
    // if successfull, return the list of videos
    .then((videos)=> {
        res.render('video/listVideos',{videos:videos});// pass in the array of video objects
    })
    .catch(err=>console.log(err));
});

// the ID of the video (id is appended to the back of the link)
router.get('/edit/:id',ensureAuthenticated, (req,res)=>{

    //find from data base where the id is the req.params.id( in this case w eare taking the ID from the req link)
    Video.findOne({
        where:{
            id:req.params.id
        }
    }).then((video)=>{
        if(req.user.id === video.userId){
            checkOptions(video);
            res.render('video/editVideo',{
                  video
            });     
        }else{
            alertMessage(res, 'danger', 'Unauthorised access to the video', 'fas fa-exclaimation-circle', true);
            res.redirect('/logout');


        }    
    }).catch(err=>console.log(err));
});

// .search() returns the index of the location of the start of the match
function checkOptions(video){
    video.chineseLang = (video.language.search('Chinese')>=0)?'checked':'';
    video.englishLang = (video.language.search('English')>=0)?'checked':'';
    video.malayLang = (video.language.search('Malay')>=0)?'checked':'';
    video.tamilLang = (video.language.search('Tamil')>=0)?'checked':'';

    video.chinese = (video.subtitles.search('Chinese')>=0)?'checked':'';
    video.english = (video.subtitles.search('English')>=0)?'checked':'';
    video.malay = (video.subtitles.search('Malay')>=0)?'checked':'';
    video.tamil = (video.subtitles.search('Tamil')>=0)?'checked':'';

}

//save edited video

router.put('/saveEditedVideo/:id',ensureAuthenticated, (req,res)=>{
	
	//retrieves edited values from req.body
	let title = req.body.title;
	let story = req.body.story.slice(0, 1000);
	let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
	let language = req.body.language.toString();
	let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let posterURL = req.body.posterURL;
    let starring = req.body.starring;
    
	//set variables here to save to video table
	Video.update({
        title,
        story,
        dateRelease,
        language,
        subtitles,
        classification,
        posterURL,
        starring
        
    }, {
        where: {
            id:req.params.id
        }   
    }).then(()=>{
        res.redirect('/video/listVideos');
    }).catch(err=>console.log(err));
});


router.get('/showAddVideo',ensureAuthenticated, (req,res)=>{
    res.render('video/addVideo');

});


// adds new video jot from /video/addVideo handle bar html
router.post('/addVideo', ensureAuthenticated, (req, res)=>{
    let title = req.body.title;
    let story = req.body.story.slice(0,1999); // slice means to take only the first 2000 characters from the entered story input
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY'); // using moment libary to change the date format
    let language = req.body.language.toString();

    // enhanced if else statement (ternary) if subtitles is undefined (empty) it is set as empty, else, convert it to string
    let subtitles = req.body.subtitles === undefined?'':req.body.subtitles.toString(); // === means to check if the type
    let classification = req.body.classification;
    let userId = req.user.id;
    let posterURL = req.body.posterURL;
    let starring = req.body.starring;

    // Multi-value components return array of strings or undefined 
    // store the video into the data base
    Video.create({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
        posterURL,
        starring,
        userId
    })
    // if created successfully then
    .then((video) =>{
        res.redirect('/video/listVideos');
    })
    .catch(err=>console.log(err))
});


router.get('/delete/:id', ensureAuthenticated, (req, res)=>{
    let videoId = req.params.id;
    let userId = req.user.id;
    
	// Select * from videos where videos.id=videoID and videos.userId=userID
   
   Video.findOne({
        where:{
            id:videoId,
            userId:userId
        },
        attributes: ['id', 'userId']
    }).then((video)=>{
        
		// if record is found, user is owner of video
        
		if(video!=null){
            Video.destroy({
                where:{
                    id:videoId
                }
            // when true
            }).then(()=>{
                alertMessage(res, 'info', 'Video Jot deleted', 'far fa-trash-alt', true);
                res.redirect('/video/listVideos'); // To retrieve all videos again
            }).catch(err =>console.log(err));
        }else{
            alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
			res.redirect('/logout');
        }
    }).catch(err=>console.log(err));
});




module.exports = router;
