import responseHandler from '../../response';
import UserModel from "../auth/userModel";
import {BadRequest, Forbidden} from "../../errors";

export default class UserController {
    
    static async getAllUsers(req, res, next) {  
        try {
            responseHandler(res,'SUCCESS',await UserModel.find(),null);
        } catch (error) {
            return next(error);
        } 
    }

    static async GetUser(req, res, next) {
        req.checkParams('id', 'Incorrect ID').trim().isMongoId();
        try {
            await req.asyncValidationErrors();
            const id = req.params.id;
            console.log(req.params);
            if(req.SuperAdmin || req.user._id.toString() === id){
                responseHandler(res,'SUCCESS',await UserModel.find({_id:id}));
            }else{
                throw new Forbidden("You don't have permission to access this resource");
            }   
        } catch (error) {
            //when error is validation error in the server error middleware have an if(error instanse of Arrey)
            return next(error);
        }
    }

    static async CreateUser(req, res, next) {
        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        try {
            req.checkBody('firstname', 'Firstname cannot be blank.').notEmpty();
            req.checkBody('lastname', 'Lastname cannot be blank.').notEmpty();
            req.checkBody('email', 'Incorect email address').isEmail();
            req.checkBody('phone','Incorect phone number').isMobilePhone('any');
            req.checkBody('password', 'Password cannot be blank.').notEmpty();
            req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});
            await req.asyncValidationErrors();
           
            let inserted = new UserModel({
                firstname: req.body.firstname,
                lastname : req.body.lastname,
                email    : {address:req.body.email,},
                phone    : {number:req.body.phone,},
                type     : req.body.type,
                password : req.body.password,
            }); 
            const user = await inserted.InsertUser();
            const responseData = {
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email.address
            };
            responseHandler(res,'CREATE_USER_SUCCESS',responseData);
        } catch (error) {
            return next(error);
        } 
    }

    static async UpdateUser(req, res ,next) {
        let updateData = {};
        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        req.checkBody('firstName', 'First name cannot be blank.').notEmpty();
        req.checkBody('lastName', 'Last name cannot be blank.').notEmpty();
        req.checkBody('phone','Incorect phone number').isMobilePhone('any');
        req.checkBody('newpassword', 'New password cannot be blank.').notEmpty()
            .len({min: 6}).withMessage('New password must be longer than 6 characters.');
        req.checkBody('currentpassword', 'Password cannot be blank.').notEmpty();
        req.checkParams('id', 'Incorrect ID').trim().isMongoId();

        try {
            await req.asyncValidationErrors();

            updateData.firstname = req.body.firstName;
            updateData.lastname = req.body.lastName;
            updateData.password = req.body.newpassword;
            updateData.phone = { number: req.body.phone };

            const { id } = req.params;
            if(req.SuperAdmin || req.user._id.toString() === id){
                if(await UserModel.prototype.CheckPassword(req.user._id,req.body.currentpassword)) {
                    await UserModel.findByIdAndUpdate(id,updateData).exec();
                    responseHandler(res,'UPDATE_USER_SUCCESS');
                } else {
                    throw new BadRequest("Incorrect password");
                }
            } else {
                throw new Forbidden("You don't have permission to access this resource");
            } 
        } catch (error) {
            return next(error);
        } 
    }
    static async DeleteUser(req, res, next) {
        req.checkParams('id', 'Incorrect ID').trim().isMongoId();
        try {
            await req.asyncValidationErrors();
            const { id } = req.params;
            if(req.SuperAdmin || req.user._id.toString() === id){
                if(await UserModel.prototype.CheckPassword(req.user._id,req.body.currentpassword)) {
                    await UserModel.findByIdAndRemove(id).exec();
                    responseHandler(res,'DELETE_USER_SUCCESS');
                } else {
                    throw new BadRequest("Incorrect password");
                }
            } else {
                throw new Forbidden("You don't have permission to access this resource");
            } 
        } catch(error) {
            return next(error);
        }
    }
}
