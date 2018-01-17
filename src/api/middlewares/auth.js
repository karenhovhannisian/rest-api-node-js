import UserModel from '../modules/auth/userModel';
import {AuthError, Forbidden} from "../errors";

export async function checkAuthentication(req,res,next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader.indexOf("Bearer ") === -1) {
            throw new AuthError("Unauthorized");
        }

        let user = await UserModel.prototype.IsLoggedIn(authorizationHeader.substring(7));

        if (user.type === 1) {
            req.SuperAdmin = true;
        } else {
            req.SuperAdmin = false;
        }
        req.IsLoggedIn = true;
        delete user.type;
        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        req.IsLoggedIn = false;
        req.SuperAdmin = false;
        next(error);
    }
}

export function MustBeLoggedIn(req,res,next){
    if(req.IsLoggedIn){
        next();
    } else {
        next(new AuthError('Unauthorized'));
    } 
}

export function MustBeSuperAdmin(req,res,next){
    if(req.IsLoggedIn && req.SuperAdmin){
        next();
    } else {
        next(new Forbidden("You don't have permission to access this resource"));
    } 
}

export function MustNotBeLoggedIn(req,res,next){
    next();
}