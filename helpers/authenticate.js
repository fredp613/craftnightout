'use strict'

import jwt from "jsonwebtoken";

export default function isAuthenticated(mongoose, customOpenPaths, rootPath) { 

	return function(req, res, next) {
	 	let userAuthOpenPaths = [rootPath + "/login",
						rootPath + "/recover", 
						rootPath + "/register", 
						rootPath + "/recoverconfirm"]
		let openPaths = userAuthOpenPaths.concat(customOpenPaths);
		console.log(openPaths)
		
		if (!req.cookies.Token && !(openPaths.includes(req.path))) {
			req.isAuthenticated = false;
			res.redirect('/users/login');

 		} else {

			//get current user, validate token (ensure that it exists and is valid)
			if (req.cookies.Token !== undefined) {
				const token = req.cookies.Token;
				let decoded = jwt.verify(token, 'superSecret');
				let requestingIP = req.headers['x-forwarded-for']; 
				let decodedIPs = decoded.IPs;
				console.log(decodedIPs)
				console.log(requestingIP);
				if (decodedIPs.indexOf(requestingIP) !== -1) {
					req.isAuthenticated = true;
					next();
				} else {				
					console.log("is not auth");
					req.isAuthenticated = false;
					if (!openPaths.includes(req.path)){
						res.redirect('/users/login');
					} else {
						next();
					}
				}	

			} else {
				next();
			}						
      }
	}
}
