const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private

router.get('/me', [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ], async(req, res) => {
    try{
        const profile = await profile.findOne({user: req.user.id}).populate('user', 
        ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
        res.json(profile);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    };
});



// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/',   auth,
[
  check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
    .not()
    .isEmpty()
], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
      } = req.body;

      //Build profile object

      const profileFields = {}
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;

      if(skills) {
          profileFields.skills = skills.split(',').map(skill => skill.trim());
      }

      //Build social object

      profileFields.social = {}
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(facebook) profileFields.social.facebook = facebook;
      if(linkedin) profileFields.social.linkendin = linkendin;
      if(instagram) profileFields.social.instagram = instagram;


      try {
          let profile = await Profile.findOne({user: req.user.id});

          if(profile) {
              //update
              profile = await Profile.findOneAndUpdate(
                  {user: req.user.id}, 
                  {$set: profileFields},
                  {new: true}
                );

                return res.json(profile);

          }

          // Create

          profile = new Profile(profileFields);

          await profile.save();
          res.json(profile);

      } catch(err) {
          console.error(err.message);
          res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/profile
// @desc     Get all profile
// @access   Public

router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }

});

module.exports = router;
