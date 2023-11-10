const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        //get all posts and join w/ user
        const postData = await Post.findAll({
            include: User,
        });

        //serialize for template
        const posts = postData.map((post) => post.get({ plain: true }));

        //pass data into template 
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({where: req.params.id}, 
            include: [
                {
                    moder: User,
                    attributes: ['name'],
                },
            ],
        );

        const post = postData.get({ plain: true });

        res.render('post', {
            post,
            logged_in: req.session.logged_in
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
});

//withAuth

router.get('/profile', withAuth, async (req, res) => {
    try {
        //find logged in user w/ session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;