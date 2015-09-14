
var mysql = require('../config/db').pool;
var nodemailer = require('nodemailer');
var userManager = require('../models/userModel');


function getDate(val) {
    var d = new Date(val);
    var dt = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var selectdate = Pad("0", dt, 2) + '/' + Pad("0", month, 2)  + '/' + year;
    return selectdate;
}

function getTime(val) {
    var d = new Date(val);
    var minite = d.getMinutes();
    var hour = d.getHours();
    var second = d.getSeconds();
    var selectdate = Pad("0", hour, 2) + ':' + Pad("0", minite, 2) + ':' + Pad("0", second, 2);
    return selectdate;
}
function Pad(padString, value, length) {
    var str = value.toString();
    while (str.length < length)
        str = padString + str;

    return str;
}

/**
 * @function pages
 * @param req
 * @param res
 * @param next
 * @description get list of menus with related pages
 */
exports.pages = function (req, res, next) {
    var role;

    var pagesjson = [
        { 'pagename': 'Add Pack', 'href': 'add-pack', 'id': 'add-pack', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
        { 'pagename': 'Add Search Content', 'href': 'add-search-content', 'id': 'add-search-content', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
        { 'pagename': 'Add Content List', 'href': 'add-content-list', 'id': 'add-content-list', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
        { 'pagename': 'Change Password', 'href': 'changepassword', 'id': 'changepassword', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] }
    ];

    if (req.session) {
        if (req.session.pack_UserName) {
            if (req.session.pack_StoreId) {
                role = req.session.pack_UserRole;
                var pageData = getPages(role);
                //res.render('index', { title: 'Express', username: req.session.pack_UserName, Pages: pageData, userrole: req.session.pack_UserRole });
                res.render('index', { title: 'Express', username: req.session.pack_FullName, Pages: pageData, userrole: req.session.pack_UserType, lastlogin: " " + getDate(req.session.pack_lastlogin) + " " + getTime(req.session.pack_lastlogin) });
            }
            else {
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    else {
        res.redirect('/accountlogin');
    }
}

/**
 * @function login
 * @param req
 * @param res
 * @param next
 * @description user can login
 */
exports.login = function (req, res, next) {
    if (req.session) {
        if (req.session.pack_UserName) {
            if (req.session.pack_StoreId) {
                res.redirect("/add-pack");
            }
            else {
                res.redirect("/add-pack");
            }
        }
        else {
            res.render('account-login', { error: '' });
        }
    }
    else {
        res.render('account-login', { error: '' });
    }
}
/**
 * @function logout
 * @param req
 * @param res
 * @param next
 * @description user can logout
 */
exports.logout = function (req, res, next) {
    try {
        if (req.session) {
            if (req.session.pack_UserName) {
                if (req.session.pack_StoreId) {
                    req.session = null;
                    res.redirect('/accountlogin');
                }
                else {
                    res.redirect('/accountlogin');
                }
            }else{
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    catch (error) {
        res.render('account-login', { error: error.message });
    }
}
/**
 * @function authenticate
 * @param req
 * @param res
 * @param next
 * @description user is authenticated
 */
exports.authenticate = function (req, res, next) {
    try {
        mysql.getConnection('CMS', function (err, connection_central) {
            userManager.getUserDetails( connection_central, req.body.username, req.body.password, function( err, userDetails ){
                //console.log( userDetails[0] );
                if (err) {
                    res.render('account-login', { error: 'Error in database connection.' });
                } else {
                    if (userDetails.length > 0) {
                        if (userDetails[0].ld_active == 1) {
                            if(userDetails[0].ld_role == 'Store Manager') {

                                var session = req.session;
                                session.pack_UserId = userDetails[0].ld_id;
                                session.pack_UserRole = userDetails[0].ld_role;
                                session.pack_UserName = req.body.username;
                                session.pack_Password = req.body.password;
                                session.pack_Email = userDetails[0].ld_email_id;
                                session.pack_FullName = userDetails[0].ld_display_name;
                                session.pack_lastlogin = userDetails[0].ld_last_login;
                                session.pack_UserType = userDetails[0].ld_user_type;
                                session.pack_StoreId = userDetails[0].su_st_id;//coming from new store's user table.
                                connection_central.release();
                                res.redirect('/');
                            } else {
                                connection_central.release();
                                res.render('account-login', { error: 'Only Store Admin/Manager are allowed to login.' });
                            }
                        }
                        else {
                            connection_central.release();
                            res.render('account-login', { error: 'Your account has been disable.' });
                        }
                    } else {
                        connection_central.release();
                        res.render('account-login', { error: 'Invalid Username / Password.' });
                    }
                }
            });
        });
    }
    catch (error) {
        res.render('account-login', { error: 'Error in database connection.' });
    }
}
/**
 * #function getPages
 * @param role
 * @returns json array
 * @description get list of pages allowed as per user-role
 */
function getPages(role) {
    if (role == "Super Admin" || role == "Store Manager") {

        var pagesjson = [
            { 'pagename': 'Add Pack', 'href': 'add-pack', 'id': 'add-pack', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
            { 'pagename': 'Add Search Content', 'href': 'add-search-content', 'id': 'add-search-content', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
            { 'pagename': 'Add Content List', 'href': 'add-content-list', 'id': 'add-content-list', 'class': 'fa fa-briefcase', 'submenuflag': '0', 'sub': [] },
            { 'pagename': 'Change Password', 'href': 'changepassword', 'id': 'changepassword', 'class': 'fa fa-align-left', 'submenuflag': '0', 'sub': [] }
        ];
        return pagesjson;
    }
}
/**
 * @function viewForgotPassword
 * @param req
 * @param res
 * @param next
 * @description display forgot password page
 */
exports.viewForgotPassword = function (req, res, next) {
    req.session = null;
    res.render('account-forgot', { error: '', msg: '' });
}
/**
 * @function forgotPassword
 * @param req
 * @param res
 * @param next
 * @description get forgot password for user
 */
exports.forgotPassword = function (req, res, next) {
    try {
        mysql.getConnection('CMS', function (err, connection_central) {

            userManager.getUserByUserIdByEmail( connection_central, req.body.userid, req.body.emailid, function( err, userDetails ){
                console.log( userDetails[0] );
                if (err) {
                    res.render('account-login', { error: 'Error in database connection.' });
                } else {
                    if (userDetails.length > 0) {

                        var smtpTransport = nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: "jetsynthesis@gmail.com",
                                pass: "j3tsynthes1s"
                            }
                        });
                        var mailOptions = {
                            to: req.body.emailid,//'sujata.patne@jetsynthesys.com',
                            subject: 'Forgot Password',
                            html: "<p>Hi, " + userDetails[0].ld_user_id + " <br />This is your password: " + userDetails[0].ld_user_pwd + "</p>"
                        }
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.end("error");
                            } else {
                                connection_central.release();
                                res.render('account-forgot', { error: '', msg: 'Please check your mail. Password successfully sent to your email' });
                                res.end("sent");
                            }
                        });
                    }
                    else {
                        connection_central.release();
                        res.render('account-forgot', { error: 'Invalid UserId / EmailId.', msg: '' });
                    }
                }
            });
        });
    }
    catch (err) {
        connection_central.end();
        res.render('account-forgot', { error: 'Error in database connection.' });
    }
}
/**
 * @function viewChangePassword
 * @param req
 * @param res
 * @param next
 * @description displays change password page
 */
exports.viewChangePassword = function (req, res, next) {
    req.session = null;
    res.render('account-changepassword', { error: '' });
}
/**
 * @function changePassword
 * @param req
 * @param res
 * @description process change password request
 */
exports.changePassword = function (req, res) {
    try {
        if (req.session) {
            if (req.session.pack_UserName) {
                var session = req.session;
                console.log( req.session.pack_Email );
                mysql.getConnection('CMS', function (err, connection_central) {
                    if(req.body.oldpassword == session.pack_Password) {
                        userManager.updateUser( connection_central, req.body.newpassword, new Date(), session.pack_UserId, function( err, response ) {
                            if (err) {
                                connection_central.release();
                                res.status(500).json(err.message);
                            }else {
                                session.pack_Password = req.body.newpassword;
                                var smtpTransport = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: "jetsynthesis@gmail.com",
                                        pass: "j3tsynthes1s"
                                    }
                                });
                                var mailOptions = {
                                    to: session.pack_Email,
                                    subject: 'Change Password',
                                    html: "<p>Hi, " + session.pack_UserName + " <br />This is your password: " + req.body.newpassword + "</p>"
                                }
                                smtpTransport.sendMail(mailOptions, function (error, response) {
                                    if (error) {
                                        connection_central.release();
                                        res.end("error");
                                    } else {
                                        connection_central.release();
                                        res.send({ success: true, message: 'Password updated successfully. Please check your mail.' });
                                    }
                                });
                            }
                        }); 
                    }else {
                        connection_central.release();
                        res.send({ success: false, message: 'Old Password does not match.' });
                    }
                })
            }
            else {
                res.redirect('/accountlogin');
            }
        }
        else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
};
