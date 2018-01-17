import mongoose from 'mongoose';
import crypto from 'crypto';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import config from '../../config';
import {AuthError, BadRequest, Conflict} from "../../errors";

const Schema = mongoose.Schema;


let UserSchema = new Schema({
	firstname: {type: String},
	lastname: {type: String},
	email: {type: {address:{type: String, index: { unique: true }},status:{type:Boolean,default:false},confirm_key:{type:String,default:null}}},
	phone: {type: {number:String,status:{type:Boolean,default:false},confirm_key:{type:String,default:null}},default:null},
	create_at: {type: Date, default: Date.now},
	type: {type:Number, default: 0},
	password: {type: String},
	remember_key: {type: String, default: null},
    removed: {type: Boolean, default: false},
});

UserSchema.pre('findOneAndUpdate',function (next){
	if(this._update.password){
		this._update.password = crypto.createHash('sha1').update(this._update.password).digest("hex");
	}
	next();
});
let UserModel = mongoose.model('UserSchema', UserSchema);

UserModel.prototype.InsertUser = async function(){
	try {
		if(!_.isEmpty(await UserModel.findOne({'email.address':this.email.address}))){
			throw new Conflict('Email already exists');
			return false;
		}
		this.password = crypto.createHash('sha1').update(this.password).digest("hex");
		this.email.confirm_key = crypto.createHash('sha1').update(this.email.address).digest("hex");
		const user = (await this.save()).toObject();
		return user;
	} catch (error) {
		throw error;
		return false;
	}
};

UserModel.prototype.Signin = async function(email, password, remember = false){
	try {
		let temp = await UserModel.findOne({'email.address':email});
		if(!_.isEmpty(temp)){

			if(temp.removed){
				throw new Conflict('User is blocked');
				return false;
			}
			if(temp.password === crypto.createHash('sha1').update(password).digest("hex")){
				const token = jwt.sign({id: temp.id,email: temp.email},config.jwt.secret,{
                    expiresIn : remember ? 60*60*24*7 : 60*60*24
				});
				return {
					_id      : temp._id,
					token    : token,
					firstname: temp.firstname,
					lastname : temp.lastname,
					email    : {addrss:temp.email.address},
					phone    : temp.phone,
					type     : temp.type,
					removed  : temp.removed,
				};
			} else {
				throw new BadRequest('Invalid email or password');
				return false;
			}
		} else {
			throw new BadRequest('Invalid email or password');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};

UserModel.prototype.IsLoggedIn = async function (token){
	try {

		let decoded = jwt.verify(token, config.jwt.secret);

		let user = await UserModel.findById(decoded.id)
		    .select(['firstname','lastname','email.address','phone','type','removed']);

		if(!_.isEmpty(user)){
			if(user.removed){
				throw new Conflict('User is blocked');
			}

			return user;
		} else {
			throw new AuthError('Invalid token');
		}
	} catch(err) {
	    throw err;
	}
};

UserModel.prototype.CheckPassword = async function (id, password){
	try {
		let user = await UserModel.findById(id).select(['password']).exec();
		if(user.password === crypto.createHash('sha1').update(password).digest("hex")){
			return true;
		} 
		return false;
	} catch(err) {
		throw err;
		return false;
	}
};
export default UserModel;
