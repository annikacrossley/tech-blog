const router = require('express').Router();
const { User } = require('../../models')

router.post('/create-user', async (req, res) => {

    const {name, password} = req.body;

    if (!name || !password) {
        return res.status(400).json("Please create a username and password.")
    }

    try {
        const newUser = await User.create({
            name,
            password
        })

        res.status(200).json(newUser);

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try{
        const userData = await User.findOne({where:{name: req.body.name}})

        const validPassword = userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
              .status(400)
              .json({ message: 'Incorrect password, please try again' });
            return;
          }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are logged in.' })
        });
        
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;