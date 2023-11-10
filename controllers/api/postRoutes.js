const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/add-post', withAuth, async (req, res) => {
    const {content} = req.body;
    const user_id = req.session.user_id;

    try {
        const newPost = await Post.create({
            content,
            user_id
        });

        res.status(200).json(newPost);

    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/delete-post', withAuth, async (req, res) => {
    try {
        const deletePost = await Post.destroy({
            where: {
                id: this.post.id;
            },
        });

        if (!deletePost) {
            res.status(404).json({ message: 'No post with this id.' });
            return;
        }

        res.status(200).json(deletePost);

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;