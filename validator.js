const email_validator = require("email-validator");

module.exports = {
    validateUserInput: async (req) => {
        let errors = [];
        let { username, e_mail, password, password2 } = req.body;
        
        if (!username || !e_mail || !password || !password2) {
            errors.push({message: "Please enter all fields"});
        }
        
        if (password != password2) {
            errors.push({message: "Passwords do not match"});
        }
    
        if(!(email_validator.validate(e_mail))){
            errors.push({message: "Invalid e-mail address"});
        }
    
        return errors;
    },

    validatePost: (req) => {
        let errors = [];

        let { title, text } = req.body;
    
        if ( !title ){
            errors.push({message: "Title is required"});
        }
    
        if ( !text ){
            errors.push({message: "Please enter some text"});
        }
    
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
    }
}
