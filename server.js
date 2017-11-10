
// const WWW_ROOT = '/var/www/html';
const WWW_ROOT = '/Users/miguelherrnsdorf/webserver/alphauno/bookStoreUno';

const http = require('http');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const url = require('url');
const mPath = require('path');
const fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    // host     : '127.0.0.1',
    user     : 'root',
    password : 'futglobal',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database : 'bookstoreuno'
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        // console.log("Error connecting database ... \n\n");
        throw err;
    }
});

const HTTP_SERVER_PORT = process.argv[2];

//BEGIN General Exceptions, TODO Improve this
process.on('uncaughtException', (err) => {
    //fs.appendFile('exception.log', `uncaughtException: ${err}`, (err) => {
    let data = (new Date()).toJSON() + ': ' + err + "\n";
    fs.appendFile('exception-'+HTTP_SERVER_PORT+'.log', data, (err) => {
        if (err) console.error('Error log:', err.message);
    });
    console.error('uncaughtException:', err);
});
//END General Exceptions

const httpServer = http.createServer((req, res) => {

    //BEGIN General Errors
    req.on('error', (err) => {
        console.error(err);
        res.statusCode = 400;
        res.end();
    });
    res.on('error', (err) => {
        console.error(err);
    });
    //END General Errors

    console.log('HTTP Client Connected: '+ req.socket.remoteAddress +':'+ req.socket.remotePort +' '+ req.url);
    var u = url.parse(req.url, true);
    var pathname = mPath.normalize(u.pathname);
    var p = pathname.substr(1).split('/'); //Path array
    
    // console.log(req.headers);
    var auth = req.headers['authorization'];
    // console.log(auth);
    function authorization() {
        if(!auth) {
            res.StatusCode = 403;
            res.end();
        } else {
            connection.query('SELECT 1 FROM User WHERE token = ?', auth, function (error, results) {
                if(results.length > 0) {
                    return true;
                } else {
                    res.StatusCode = 403;
                    res.end();
                }
            });
        }
    }

    //BEGIN User
    if (req.method === 'POST' && p[0] === 'user') {
        if (p[1] === 'create') {
            req.on('data', function(data){
                var data = JSON.parse(data);
                console.log(data);
                bcrypt.hash(data.password, 5, function( err, bcryptedPassword) {
                    var user = {
                        "Nickname": data.Nickname,
                        "username": data.username,
                        "FirstName":data.FirstName,
                        "MiddleInitial":data.MiddleInitial,
                        "LastName":data.LastName,
                        "Email":data.Email,
                        "password":bcryptedPassword,
                    }
                    connection.query('INSERT INTO user SET ?', user, function (error, results) {
                        if (error) {
                            throw error;
                            console.log("error ocurred",error);
                            res.end(JSON.stringify({registration:false}));
                        } else {
                            console.log('The results is: ', results);
                            res.end(JSON.stringify({registration:true}));
                        }
                    });
                });
            });
        } 
        else if (p[1] === 'login') {
            req.on('data', function(data){
                var user = JSON.parse(data);
                connection.query('SELECT * FROM User WHERE username = ?', user.username, function (error, results) {
                    if (error) {
                        throw error;
                        console.log("error ocurred");
                        res.end();
                    } else if(results.length > 0){
                        bcrypt.compare(user.password, results[0].Password, function(err, doesMatch){
                            if (doesMatch){
                                // var user = results[0];
                                var homeAddress = "";
                                var token = crypto.randomBytes(20).toString('hex');
                                connection.query('UPDATE user SET token=? WHERE ID=?', [token, results[0].ID], function (error, response) {
                                    if (error) {
                                        console.log("error ocurred",error);
                                        throw error;
                                        res.end()
                                    } else {
                                        console.log('User logged in');
                                    }
                                });
                                connection.query('SELECT * FROM address WHERE Type = 0 AND OwnerID = ?', results[0].ID, function (error, response1){
                                    if (error) {
                                        console.log("error ocurred",error);
                                        throw error;
                                        res.end()
                                    } else {
                                        console.log('Got home address');
                                        homeAddress =  response1[0];
                                        res.write(JSON.stringify({login:true, authorization:token, user:results[0], home:homeAddress}));
                                        res.end();
                                    }
                                });
                            } else {
                                console.log("ID and password does not match for user");
                                res.StatusCode = 401;
                                res.end(JSON.stringify({login:false}));
                            }
                        });
                    } 
                    else {
                        console.log("error ocurred");
                        res.StatusCode = 401;
                        res.end(JSON.stringify({login:false}));
                    }
                });
            });
        } 
        else if (p[1] === 'logout') {
            authorization();
            connection.query('UPDATE user SET token="" WHERE token=?', [auth], function (error, results, fields) {
                if (error) {
                    console.log("error ocurred",error);
                    throw error;
                    res.end()
                } else {
                    console.log('User logedout');
                    res.end(JSON.stringify(results));
                }
            });
        } 
        else if (p[1] === 'addCC') {
            authorization();
            req.on('data', function(data){
                var data = JSON.parse(data);
                // console.log(data);return;
                var ccAddress = {
                    "OwnerID":data.OwnerID,
                    "Country": data.Country,
                    "City":data.City,
                    "State":data.State,
                    "Street":data.Street,
                    "ZipCode":data.ZipCode,
                    "Type":data.Type
                }
                connection.query('INSERT INTO address SET ?', ccAddress, function (error, results) {
                    if (error) {
                        console.log("error ocurred",error);
                        throw error;
                        res.end()
                    } else {
                        // var cipher = crypto.createCipher('aes192', 'a password');
                        // let encrypted = cipher.update(data.Number, 'utf8', 'hex');
                        // encrypted += cipher.final('hex');
                        var cc = {
                            "FirstName":data.FirstName,
                            "MiddleInitial":data.MiddleInitial,
                            "LastName":data.LastName,
                            "Number":data.Number,
                            "SecurityCode":data.SecurityCode,
                            "ExpirationDate":data.ExpirationDate,
                            "BillingAddressID":results.insertId,
                            "OwnerID":data.OwnerID
                        }
                        connection.query('INSERT INTO creditcard SET ?', cc, function (error, results) {
                            if (error) {
                                console.log("error ocurred",error);
                                throw error;
                                res.end()
                            } else {
                                console.log('Credit Card inserted');
                                res.end();
                            }
                        });
                    }
                });                
            });
        } 
        else if (p[1] === 'addAddress') {
            authorization();
            req.on('data', function(data){
                var data = JSON.parse(data);
                // console.log(data);
                var address = {
                    "OwnerID":data.OwnerID,
                    "Country": data.Country,
                    "City":data.City,
                    "State":data.State,
                    "Street":data.Street,
                    "ZipCode":data.ZipCode,
                    "Type":data.Type
                }
                connection.query('INSERT INTO address SET ?', address, function (error, results) {
                    if (error) {
                        throw error;
                        console.log("error ocurred",error);
                        res.end(JSON.stringify({registration:false}));
                    } else {
                        res.end();
                    }
                });
            });
        }
    } 
    else if (req.method === 'PUT' && p[0] === 'user') {
        authorization();
        if (p[1] === 'editUser') {
            req.on('data', function(data){
                var data = JSON.parse(data);
                // console.log(data);return;
                var user = data.ID;
                var address = {
                    "OwnerID":user,
                    "Country":data.Country,
                    "City":data.City,
                    "State":data.State,
                    "Street":data.Street,
                    "ZipCode":data.ZipCode,
                    "Type":data.Type
                }
                connection.query('SELECT * FROM user WHERE ID = ?', user, function (error, results) {
                    if (error) {
                        throw error;
                        console.log("error ocurred");
                        res.end();
                    } else if(results.length > 0) {
                        bcrypt.compare(data.Password, results[0].Password, function(err, matches){
                            if (matches){
                                connection.query('UPDATE user SET Email=?, username=?, Nickname=?, FirstName=?, MiddleInitial=?, LastName=? WHERE ID=?', 
                                    [data.Email, data.username, data.Nickname, data.FirstName, data.MiddleInitial, data.LastName, user], function (error, results, fields) {
                                    if (error) {
                                        console.log("error ocurred",error);
                                        throw error;
                                        res.end()
                                    } else {
                                        connection.query('SELECT OwnerID FROM address WHERE OwnerID = ?', user, function (error, results)  {
                                            if (error) {
                                                console.log("error ocurred",error);
                                                throw error;
                                                res.end()
                                            } else {
                                                if (results.length > 0) {
                                                    connection.query('UPDATE address SET ? WHERE OwnerID = ?', [address, user], function (error, results, fields) {
                                                        if (error) {
                                                            console.log("error ocurred",error);
                                                            throw error;
                                                            res.end()
                                                        } else {
                                                            var uinfo
                                                            connection.query('SELECT * FROM user WHERE ID = ?', user, function (error, userinfo)  {
                                                                uinfo = userinfo[0];
                                                            });
                                                            connection.query('SELECT * FROM address WHERE OwnerID = ?', user, function (error, addressinfo) {
                                                                res.write(JSON.stringify({user:uinfo, home:addressinfo[0], update:true}));
                                                                // console.log(JSON.stringify({user:uinfo, home:addressinfo[0]}));
                                                                res.end();
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    connection.query('INSERT INTO address SET ?', address, function (error, results) {
                                                        if (error) {
                                                            throw error;
                                                            console.log("error ocurred",error);
                                                            res.end(JSON.stringify({registration:false}));
                                                        } else {
                                                            var uinfo
                                                            connection.query('SELECT * FROM user WHERE ID = ?', user, function (error, userinfo)  {
                                                                uinfo = userinfo[0];
                                                            });
                                                            connection.query('SELECT * FROM address WHERE OwnerID = ?', user, function (error, addressinfo) {
                                                                res.write(JSON.stringify({user:uinfo, home:addressinfo[0]}));
                                                                // console.log(JSON.stringify({user:uinfo, home:addressinfo[0]}));
                                                                res.end();
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log("password does not match for user");
                                res.StatusCode = 401;
                                res.end(JSON.stringify({update:false}));
                            }
                        });
                    }
                });   
            });
        }
        else if (p[1] === 'editCC') {
            authorization();
            req.on('data', function(data){
                var data = JSON.parse(data);
                // console.log(data.cc);return;
                var ccAddress = {
                    "Country": data.cc.Country,
                    "City":data.cc.City,
                    "State":data.cc.State,
                    "Street":data.cc.Street,
                    "ZipCode":data.cc.ZipCode
                }
                connection.query('UPDATE address SET ? WHERE ID = ?',[ccAddress, data.cc.ID], function (error, results) {
                    if (error) {
                        console.log("error ocurred",error);
                        throw error;
                        res.end()
                    } else {
                        // var cipher = crypto.createCipher('aes192', 'a password');
                        // let encrypted = cipher.update(data.cc.Number, 'utf8', 'hex');
                        // encrypted += cipher.final('hex');
                        var cc = {
                            "FirstName":data.cc.FirstName,
                            "MiddleInitial":data.cc.MiddleInitial,
                            "LastName":data.cc.LastName,
                            "Number":data.cc.Number,
                            "SecurityCode":data.cc.SecurityCode,
                            "ExpirationDate":data.cc.ExpirationDate
                        }
                        connection.query('UPDATE creditcard SET ? WHERE BillingAddressID = ?',[cc, data.cc.ID], function (error, results) {
                            if (error) {
                                console.log("error ocurred",error);
                                throw error;
                                res.end()
                            } else {
                                console.log('Credit Card updated');
                                res.end();
                            }
                        });
                    }
                });                
            });
        } 
        else if (p[1] === 'editAddress') {
            authorization();
            req.on('data', function(data){
                var data = JSON.parse(data);
                var address = {
                    "OwnerID":data.shipping.OwnerID,
                    "Country": data.shipping.Country,
                    "City":data.shipping.City,
                    "State":data.shipping.State,
                    "Street":data.shipping.Street,
                    "ZipCode":data.shipping.ZipCode,
                    "Type":data.shipping.Type
                }
                connection.query('UPDATE address SET ? WHERE ID = ?', [address, data.shipping.ID], function (error, results, fields) {
                    if (error) {
                        console.log("error ocurred",error);
                        throw error;
                        res.end()
                    } else {
                        res.end();
                    }
                });
            });
        }
    } 
    else if (req.method === 'DELETE' && p[0] === 'user') {
        authorization();
        if (p[1] === 'deleteUser') {
            req.on('data', function(data){
                var user = JSON.parse(data);
                connection.query('DELETE FROM user WHERE ID = ?', user.ID, function (error, results) {
                    if(error) {
                        throw error;
                    } else {
                        res.end();
                    }
                });
            });
            res.end();

        } else if (p[1] === 'deleteCC') {
            authorization();
            req.on('data', function(data){
                var cc = JSON.parse(data);
            });
            res.end();

        } else if (p[1] === 'deleteAddress') {
            authorization();
            req.on('data', function(data){
                var address = JSON.parse(data);
            });
            res.end();
        } 
    //END User
    
    } //BEGIN Books
    else if (req.method === 'GET' && p[0] === 'books') {
        if (p[1] === 'list') {
            console.log('Geting books...');
            connection.query('SELECT * FROM books', function (error, results) {
                if(error) {
                    console.log('No book found');
                    throw error;
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                }
            });
        }
    }
    else if (req.method === 'GET' && p[0] === 'address') {
        if (p[1] === 'shipping') {
            connection.query('SELECT * FROM address WHERE OwnerID = ? AND Type = 1', p[2], function (error, addressinfo) {
                res.write(JSON.stringify({shipping:addressinfo}));
                res.end(); 
            });
        }
    }
    else if (req.method === 'GET' && p[0] === 'user') {
        if (p[1] === 'cc') {
            connection.query('SELECT creditcard.*, address.* FROM creditcard LEFT JOIN address ON creditcard.BillingAddressID = address.ID WHERE creditcard.OwnerID = ?', p[2], function (error, info) {
                // var decipher = crypto.createDecipher('aes192', 'a password');
                // let decrypted = decipher.update(encrypted, 'hex', 'utf8');
                // decrypted += decipher.final('utf8');

                res.write(JSON.stringify({cc:info}));
                res.end();
            });
        }
    }
    else {
    //BEGIN Web Server
        fs.createReadStream(WWW_ROOT+pathname).on('error', (err) => {
            if (err.code === 'EISDIR') {
                if (pathname.slice(-1) !== '/') {
                    res.statusCode = 302;
                    res.setHeader('Location', pathname + '/');
                    res.end();
                    return;
                }
                fs.createReadStream(WWW_ROOT+pathname+'index.html').on('error', (err) => {
                    res.statusCode = 403;
                    res.end();
                    throw err;
                }).pipe(res);
            } else {
                res.statusCode = 404;
                res.end();
                throw err;
            }
        }).pipe(res);
    //END Web Server
    }

}).listen(HTTP_SERVER_PORT).on('error', (err) => {
    console.log(`Error on httpServer: ${err.message}`);
});


