module.exports = {
    
    validatePost: (req) => {
        
        req.checkBody('title', 'Title is required').notEmpty();
        req.checkBody('text', 'Text is required').notEmpty();

        let errors = req.validationErrors();
    
        return errors;
    },

    validateUser: async (User, req) => {
        let errors = [];

        let { username, e_mail } = req.body;

        await User.findOne({ where: {username: username} }).then(user => {
        if ( user ) {
            errors.push({ message : 'Username already taken' }); 
            }
        });

        await User.findOne({ where: {e_mail: e_mail} }).then(user => {
        if ( user ) {
            errors.push({ message : 'E-mail already used' });
            }
        });
        
        return errors;
    },

    validateUserInput: (req) => {

        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('e_mail', 'E-mail is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Password confirmation is required').notEmpty();
        req.checkBody('e_mail', 'E-mail is not valid').isEmail();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        let errors = req.validationErrors();

        return errors;

    } 
}