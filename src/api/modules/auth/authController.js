import responseHandler from '../../response';
import UserModel from "./userModel";

export default class AuthController {

    static async signIn(req, res, next) {
        try {
            req.checkBody('email', 'Email cannot be blank.').notEmpty();
            req.checkBody('email', 'Email is not valid.').isEmail();
    
            req.checkBody('password', 'Password cannot be blank.').notEmpty();
            req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});
    
            req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
            let remember = req.body.remember || false;
            await req.asyncValidationErrors();
            responseHandler(res,'SIGNED_IN', await UserModel.prototype.Signin(req.body.email,req.body.password,remember));

        } catch (error) {
            return next(error);
        }
    }

    static async signUp(req, res, next) {
        console.log("sdsd");
        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        try {
            req.checkBody('firstName', 'Firstname cannot be blank.').notEmpty();
            req.checkBody('lastName', 'Lastname cannot be blank.').notEmpty();
            req.checkBody('email', 'Incorect email address').isEmail();
            req.checkBody('phone','Incorect phone number').isMobilePhone('any');
            req.checkBody('password', 'Password cannot be blank.').notEmpty();
            req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});
            await req.asyncValidationErrors();
           
            let inserted = new UserModel({
                firstname: req.body.firstName,
                lastname : req.body.lastName,
                email    : {address:req.body.email,},
                phone    : {number:req.body.phone,},
                type     : req.body.type,
                password : req.body.password
            }); 
            
            const user = await inserted.InsertUser();
            
            const responseData = {
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email.address
            };

            responseHandler(res, 'SIGNED_UP', responseData);

        } catch (error) {
            return next(error);
        } 
    }

}
