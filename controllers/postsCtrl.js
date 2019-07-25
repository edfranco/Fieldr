const db = require('../models');
const response = require('./response');

// Global functions

const equalsId = (element) => {

}



const showHomePage = (req, res) => {
    if (req.session.currentUser) {
        const currentDate = new Date(Date.now());
        db.Post.find({ date_time: { '$gte': currentDate } })
            .populate('host')
            .populate({
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User',
                }
            })
            .exec((err, foundPosts) => {
                if (err) return res.render('home/show.ejs', { currentUser: req.session.currentUser });
                res.render('home/show.ejs', { currentUser: req.session.currentUser, posts: foundPosts });
            })

    } else res.render('login', { errors: [{ message: 'Something went wrong please, please log in and try again.' }] });
};


const showProfilePage = (req, res) => {
    if (req.session.currentUser) {
        const currentDate = new Date(Date.now());
        db.Post.find({
            $and : [
                { date_time: { '$gte': currentDate } },
                { $or : [ { joins: { $in: req.session.currentUser._id } }, { host: req.session.currentUser._id } ] }
            ]
        })
            .populate('host')
            .populate({
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User',
                }
            })
            .exec((err, foundPosts) => {
                if (err) return res.render('home/show.ejs', { currentUser: req.session.currentUser });
                res.render('profile/show.ejs', { currentUser: req.session.currentUser, posts: foundPosts });
            })

    } else res.render('login', { errors: [{ message: 'Something went wrong please, please log in and try again.' }] });
};

const createNewPost = (req, res) => {
    if (req.session.currentUser) {
        let errors = [];
        if (!req.body.sport) {
            errors.push({ field: 'sport', message: 'Must define a sport you want to play.' });
        }
        if (!req.body.date_time) {
            errors.push({ field: 'date_time', message: 'Must specify a date and time.' });
        }
        if (!req.body.location) {
            errors.push({ field: 'location', message: 'Must specify a location.' });
        }
        if (!req.session.currentUser) {
            errors = [];
            errors.push({ message: 'Something went wrong, please log in and try again.' });
            return res.render('login', { errors });
        }
        if (errors.length) return res.render('home/show.ejs', { currentUser: req.session.currentUser, errors });
        db.User.findById(req.session.currentUser._id, (error, foundUser) => {
            if (error) return res.render('home/show.ejs', { currentUser: req.session.currentUser, errors: [{ message: 'Something went wrong, please try again' }] });
            db.Post.create({
                sport: req.body.sport,
                date_time: req.body.date_time,
                location: req.body.location,
                descr: req.body.descr,
                host: foundUser._id,
            },
                (error, createdPost) => {
                    if (error) return res.render('home/show.ejs', { currentUser: req.session.currentUser, errors: [{ message: 'Something went wrong, please try again.' }] });
                    foundUser.posts.push(createdPost._id);
                    console.log(req.originalUrl);
                    return res.redirect(req.originalUrl);
                });
        });
    } else return res.render('login', { errors: [{ message: 'Something went wrong, please log in and try again' }] });
};



const joinPost = (req, res) => {
    db.User.findById(req.session.currentUser._id, (err, foundUser) => {
        if (foundUser.joins.includes(req.params.postId)) {
            return res.status({
                status: 400,
                message: `Already joined`
            })
        }
        if (err) return res.JSON({ status: 400, error: err });
        // This block of code triggers if the user has already joined the post
        if (foundUser.joins.includes(req.params.postId)) {
            foundUser.joins.pull(req.params.postId);
            foundUser.save();
            db.Post.findById(req.params.postId, (err, foundPost) => {
                if (err) return res.JSON({ status: 400, error: err });
                foundPost.joins.pull(req.session.currentUser._id);
                foundPost.save();
                res.redirect('/profile');
            });
        } 
        
        // This block of code triggers if the user has NOT already joined the post
        else {
            foundUser.joins.push(req.params.postId);
            foundUser.save();
            db.Post.findById(req.params.postId, (err, foundPost) => {
                if (err) return res.JSON({ status: 400, error: err });
                foundPost.joins.push(req.session.currentUser._id);
                foundPost.save();
                res.redirect('/profile');
            });
        };
    });
};

const deletePost = (req, res) => {
    console.log(req.params.postId)
    db.Post.findByIdAndDelete(req.params.postId, (error, deletedPost) => {
        if (error) return res.status(400);
        console.log(deletedPost);
        res.sendStatus(200);
    })
}


module.exports = {
    showHomePage,
    showProfilePage,
    createNewPost,
    joinPost,
    deletePost
}
