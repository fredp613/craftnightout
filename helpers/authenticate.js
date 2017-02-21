'use strict'

import jwt from "jsonwebtoken";

export default function isAuthenticated(mongoose, customOpenPaths, rootPath) { 

	return function(req, res, next) {
	 	let userAuthOpenPaths = [rootPath + "/login",
						rootPath + "/recover", 
						rootPath + "/register", 
						rootPath + "/recoverconfirm"]
		let openPaths = userAuthOpenPaths.concat(customOpenPaths);
		if (!req.cookies.Token && !wildcardSearchPath(openPaths, req.path)){
			req.isAuthenticated = false;
			res.redirect('/users/login');

 		} else {
			//get current user, validate token (ensure that it exists and is valid)
			if (req.cookies.Token !== undefined) {
				const token = req.cookies.Token;
				let decoded = jwt.verify(token, 'superSecret');
				let requestingIP = req.headers['x-forwarded-for']; 
				let decodedIPs = decoded.IPs;
				if (decodedIPs.indexOf(requestingIP) !== -1) {
					req.isAuthenticated = true;
					next();
				} else {				
					req.isAuthenticated = false;
					if (!wildcardSearchPath(openPaths, req.path)) {	
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
	function wildcardSearchPath(openPaths, requestedPath) {
		for (var i=0;i<openPaths.length;i++) {
			var cleanOpenPath = openPaths[i].replace("/","");
			var cleanRequestedPath = requestedPath.replace("/","");
			if (cleanOpenPath[i].includes(cleanRequestedPath) || cleanRequestedPath.includes(cleanOpenPath)) {
				return true;
			}
		}
	
		return false;
	}
}
