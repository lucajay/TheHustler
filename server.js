var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database');
var User        = require('./app/models/user');
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var logout 		= require('express-passport-logout')
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.use(morgan('dev'));
 
app.use(passport.initialize());

app.listen(port);
console.log('Server running on: http://localhost:' + port);
 
mongoose.connect(config.database);
 
require('./config/passport')(passport);
 
var apiRoutes = express.Router();
 
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.email || !req.body.date_of_birth || !req.body.status) {
    res.json({success: false, msg: 'All fields are mandatory'});
  } else {
    var newUser = new User({
      full_name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      date_of_birth: req.body.date_of_birth,
      status: req.body.status
    });
    newUser.save(function(err) {
      if (err) {
      	console.log(err)
        return res.json({success: false, msg: 'User already registered.'});
      }
      res.json({success: true, msg: 'Successfully created new user.'});
    });
  }
});
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    console.log(config.secret)
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'You are Successfully loggedIn ' + user.full_name + '!!'});

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
apiRoutes.post('/viewUserDetails', function(req, res){
	User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.send({success: false, msg: 'User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
        	res.setHeader('Content-Type', 'application/json')
        	res.send(JSON.stringify ({ "NAME" : user.full_name, "STATUS" : user.status, "EMAIL" : user.email, "dob" : user.date_of_birth }));
        } else {
          res.send({success: false, msg: 'Authentication failed for User. Wrong password.'});
        }
      });
    }
  });
});
apiRoutes.delete('/deleteUser', function(req, res){
	User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
        	User.findByIdAndRemove(user._id, (err, user)=>{
        		res.send({success: true, msg: 'User Deleted Successfully'});
        	})
        } else {
          res.send({success: false, msg: 'Authentication failed for User. Wrong password.'});
        }
      });
    }
  });
});
apiRoutes.put('/updateUser', function(req, res){
	User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'User not found.'});
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
        	User.findById(user._id, (err, user)=>{
        		if (err) {
        			res.send(500).send(err)
        		} else {
        			user.full_name = req.body.name || user.full_name;
        			user.date_of_birth = req.body.date_of_birth || user.date_of_birth;
        			user.status = req.body.status || user.status;
				        user.save((err, user) => {
				            if (err) {
				                res.status(500).send(err)
				            }
				            res.send({success: true, msg: 'User Updated Successfully'});
				        });
        		}
        	})
        } else {
          res.send({success: false, msg: 'Authentication failed for User. Wrong password.'});
        }
      });
    }
  });
});
apiRoutes.get('/logout', logout())
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
 
app.use('/api', apiRoutes);