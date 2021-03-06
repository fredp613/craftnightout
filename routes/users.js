'use strict'

import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from '../models/user';
import PasswordRecovery from '../models/passwordrecovery';
import { sendEmail } from '../helpers/email';
import authenticated from '../helpers/authenticate';

export default function (router, mongoose,customOpenPaths,rootPath) {
//	if (router.get('env') != "development") {      
    	router.use(authenticated(mongoose, customOpenPaths, rootPath));
//	}
    //router.use(function() {console.log("my middleware --------------")});	
	//let User = UserModel(mongoose);
	//let User = UserModel();
	//let PasswordRecovery = PasswordRecoveryModel(mongoose);
	//let PasswordRecovery = PasswordRecoveryModel();
	
	let loginRoute = rootPath ? (rootPath + "/login") : "/login";
	let logoutRoute = rootPath ? (rootPath + "/logout") : "/logout";
	let registerRoute = rootPath ? (rootPath + "/register") : "/register";
	let recoverRoute = rootPath ? (rootPath + "/recover") : "/recover";
	let recoverConfirmRoute = rootPath ? (rootPath + "/recoverconfirm") : "/recoverconfirm";

	const saltRounds = 10;

	router.get(loginRoute, (req, res) => {
		res.render('users/login', {layout: "admin.handlebars", title: "Login Page"/**, csrfToken: req.csrfToken()**/});
		//res.render('users/login', {title: "Login Page"});
	});

	router.post(loginRoute, (req, res) => {

		const param_email = req.body.email.trim().toLowerCase();
		const param_password = req.body.password;
		let errorMessage = "";		

		User.findOne({email: param_email}, (err, user) => {
			let errorMessage = "";
			let IP = req.headers['x-forwarded-for']; 
			if (err) {
				errorMessage = err.Message;
				res.render('users/login', {error: errorMessage});
			}
			if (!user) {
				errorMessage = "Invalid email";
				res.render('users/login', {error: errorMessage});
			} else {
				bcrypt.compare(param_password, user.password, function(err, compared) {
				  // res == false
					console.log(param_password, user.password, compared)
				if (compared === false || compared === undefined) {
					  res.render('users/login',{success: false,error:"Password incorrect"/**, csrfToken: req.csrfToken()**/})
				} else {
					if (user.IPs) { 
						console.log(user.IPs.indexOf(IP));
						if (user.IPs.indexOf(IP) === -1){
							user.IPs = user.IPs + "," + IP;
						}
					} else {
						user.IPs = IP;
					}
					console.log("made it here");
					user.save((err)=>{
						if (err) { 
						  console.log("error ${0}", err);
						  res.render('users/login',{
							success: false,
							error: "Problem issuing token"
							/**csrfToken: req.csrfToken()**/,
						  });
						} else {
							generateJWT(user,(token, error) => {
								if (error !== null ) {
								  res.render('users/login',{
									success: false,
									error: "Problem issuing token",
									token: null,
								  });
								} else {
									console.log("we should be good");
									res.cookie('Token', token,
									 {maxAge: 3600000, httpOnly: true});
									res.redirect("/admins")
								}
							})
						}						

					});
								
 
			   	}

		  });
		} 
	});
});
	function generateJWT(user, callback) {
		jwt.sign(user.toJSON(), 'superSecret', 
		{ expiresIn: '25d' }, function(err, token) {    
		  if (err) {
			callback(null, err);
		  } else {
			callback(token, null);
		  }                             
		}); 
	}
	router.get(registerRoute, (req, res)=> {
		res.render('users/register', {title:"register page",layout:"admin.handlebars", /**csrfToken: req.csrfToken()**/})
	});

	router.post(registerRoute, (req, res, next) => {
	  const password = req.body.password
	  const passwordConfirm = req.body.passwordConfirm
	  const email = req.body.email.trim().toLowerCase();
	  const firstName = req.body.firstName
	  const lastName = req.body.lastName
	  const IP = req.headers['x-forwarded-for']; 
	  
	  if (password !== passwordConfirm) {
		res.render('users/register', {
		  success:false,
		  message: "Passwords don't match",      
		})
	  } else {
		bcrypt.hash(password, saltRounds, function(err, hash) {		   
		  if (err) {
			return res.render('users/register',{
					success: false,
					message: "Something went wrong",
					token: null,
				  })
		  } else {
			  User.findOne({
					email: email,
					password: hash,    
					firstName: firstName,
					lastName: lastName  
			  }, (user) => {
				if (!user) {
				  let newUser = new User({
					email: email,
					password: hash,
					firstName: firstName,
					lastName: lastName,
					IPs: IP,
				  })
				
				  newUser.save((err)=> {
					let errorMessage = "";
					if (err) {
						errorMessage = "there was an error try again";
						if (err.code === 11000) {
							errorMessage = "This email already exists, try logging in";
							res.render('users/register', {error: errorMessage});
						}
					} else {						
						generateJWT(newUser,(token, error) => {
								if (error !== null ) {
								  res.render('users/register',{
									success: false,
									error: "Problem issuing token",
									token: null,
								  });
								} else {
									console.log("we should be good");
									res.cookie('Token', token,
									 {maxAge: 3600000, httpOnly: true});
									sendEmail("fredp613@gmail.com", 
										"Registered", "Thank you for registering")							
									res.redirect('/admins');
								}
							})

					}
				 });
				} else {
					res.render('users/register',{
						  success: false,
						  message: "User already exists",
						  token: null,
					})
				}
		     });	       												}                            
	   	 });  
		}
	});

	router.get(logoutRoute, (req, res, next) => {
	   res.clearCookie("Token");
		   res.redirect('/users/login');
	})

	router.delete('/authentication/delete', (req, res, next)=> {
 
		db.User.destroy({
		  where: {email: req.body.user.email}
		}).then((success)=>{
		  if (success) {
			res.json({
			  success: true,
			  message: "successfully deleted"
			})
		  } else {
			res.json({
			  success: false,
			  message: "something went wrong"
			})
		  }
		})    
	})

	router.get(recoverRoute, (req, res, next)=>{
	    res.clearCookie("Token");
		res.render('users/recover', {Title: "Recover Password", layout:"admin.handlebars", /**csrfToken: req.csrfToken()**/});
	});

	router.post(recoverRoute, (req, res, next) => {

	  const randomstring = Math.random().toString(36).slice(-8);
	  const requestingEmail = req.body.email.trim().toLowerCase();
	  let urlForRecovery = 
		"http://fredp613.com/authentication/recoverconfirm?email=" + 
	    	requestingEmail + 
	    	"&safestring=" + 
	    	randomstring;
	  let encodedURI = encodeURIComponent(urlForRecovery);	

		User.findOne({email: requestingEmail}, (err, user) => {
			let errorMessage = "";
			if (err) {
				errorMessage = err.Message;
				res.render('users/recover', {layout:"admin.handlebars",error: errorMessage, /**csrfToken: req.csrfToken()**/});
			}
			if (!user) {
			    errorMessage = "this email does not exist, please try again";
				res.render('users/recover', {layout:"admin.handlebars",error: errorMessage, /**csrfToken: req.csrfToken()**/});
			}
			if (user) {
				PasswordRecovery.remove({email: requestingEmail}, (err)=>{
					if (err) {
						res.render('users/recover',
						 {error: "Something went wrong", layout:"admin.handlebars"/**,csrfToken: req.csrfToken()**/});
					}
					let newPasswordRecovery = new PasswordRecovery({
							email: requestingEmail,
							tempPassword: randomstring
					});
					newPasswordRecovery.save((err)=>{
						if (err) {
							res.render('users/recover', 
							{layout:"admin.handlebars", error: "something went wrong try again later", 
								/**csrfToken: req.csrfToken()**/});
						} else {
							sendEmail("fredp613@gmail.com",
								"Password recovery",
								"click on the following link to reset your password:" 
								+ urlForRecovery); 
							res.render('users/recover', 
								{status: "success",layout:"admin.handlebars"/**, csrfToken: req.csrfToken()**/});	
						}	
					});	
				});
			};
		}); 
	})

	router.get(recoverConfirmRoute, (req, res, next) => {
		console.log(req.query.email + "-" + req.query.safestring);
		res.render('users/recoverconfirm', {title: "Confirm temporary password",
			email: req.query.email/**, csrfToken: req.csrfToken()**/, layout:"admin.handlebars"});
	});
	  
	router.post(recoverConfirmRoute, (req, res, next) => {
	  
	  let paramPwd = req.body.password;
	  let paramPwdConfirm = req.body.passwordConfirm;
	  let paramEmail = req.body.email
	  
	  if (paramPwd !== paramPwdConfirm) {
		 return res.render('users/recoverconfirm', {title: "Confirm temporary password", 
			error:"passwords don't match, try again"/**csrfToken: req.csrfToken()**/, layout:"admin.handlebars"});
	  }
	  PasswordRecovery.findOne({email: paramEmail}, (err, pr) => {
			if (err) {
				return res.render('users/recoverconfirm', {title: "Confirm temporary password", 
				error: err.Message, csrfToken: req.csrfToken(), layout:"admin.handlebars"});
		    }
			if (!pr) {
				return res.render('users/recoverconfirm', 
				{title: "Confirm temporary password", error:
				"somethign went wrong - not found"/**csrfToken: req.csrfToken()**/, layout:"admin.handlebars"});
			}
			if (pr) {
				bcrypt.hash(paramPwd, saltRounds, function(err, hash) {	
					User.findOne({email: paramEmail}, (err, user)=>{
						if (err) {
							return res.render('recoverconfrim', 
							{error: "something went wrong" /**csrfToken: req.csrfToken()**/, layout:"admin.handlebars"});
						}
						if (!user) {
						  return res.render('users/recoverconfirm', 
							{error: "user not found" /**csrfToken: req.csrfToken()**/, layout:"admin.handlebars"});
						}
						User.update(user, {password: hash}, null, (err)=>{
							if (err) {
								return res.render('users/recoverconfirm', {
									error: err.Message,
									layout: "admin.handlebars"
								})
							}
							res.redirect('/admins');
						});
					})
				});		
			}
	  });

	})
};

