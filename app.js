const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const ejs = require('ejs');
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'node_crud'
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static('public'));

//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));


app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.render('Dashboard');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
//yo

//route for homepage
app.get('/',(req, res) => {
    //render file index.hbs
    res.render('index');
  });
  app.get('/service', function(req, res) {
    res.render('service');
  });
  app.get('/AboutUs', function(req, res) {
    res.render('About');
  });
  
  app.get('/barat', function(req, res) {
    res.render('barat');
  });
  
  app.get('/tengah', function(req, res) {
    res.render('tengah');
  });
  
  app.get('/timur', function(req, res) {
    res.render('timur');
  });
  app.get('/Blog', function(req, res) {
    res.render('Blog');
  });
  app.get('/Bali', function(req, res) {
    res.render('Bali');
  });
  app.get('/Papua', function(req, res) {
    res.render('Papua');
  });
  
  app.get('/Jawa', function(req, res) {
    res.render('Jawa');
  });
  app.get('/Medan', function(req, res) {
    res.render('Medan');
  });
  app.get('/info', function(req, res) {
    res.render('info');
  });
  app.get('/info2', function(req, res) {
    res.render('info2');
  });
  
  app.get('/contact',(req, res) => {
    res.render('contact', {
    });
});
app.get('/Dashboard',(req, res) => {
  res.render('Dashboard', {
  });
});

//comment
app.get('/Admin',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM komen";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('Admin', {
            title : 'Comment', 
            komen : rows
        });
    });
});
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, comment: req.body.comment};
    let sql = "INSERT INTO komen SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
       res.redirect('/contact');
    });
});

app.get('/delete/:userId',(req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from komen where id = ${userId}`;
  let query = connection.query(sql,(err, result) => {
      if(err) throw err;
      res.redirect('/Admin');
  });
});



//tiket
app.get('/tiket',(req, res) => {
  let sql = "SELECT * FROM tiket";
  let query = connection.query(sql, (err, rows) => {
      if(err) throw err;
      res.render('tiket', {
          title : 'tiket', 
          tiket : rows
      });
  });
});
app.post('/order',(req, res) => { 
  let data = {nama: req.body.nama, email: req.body.email, order: req.body.order};
  let sql = "INSERT INTO tiket SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
     res.redirect('/done');
  });
});

app.get('/delete1/:userId',(req, res) => {
const userId = req.params.userId;
let sql = `DELETE from tiket where nomor = ${userId}`;
let query = connection.query(sql,(err, result) => {
    if(err) throw err;
    res.redirect('/tiket');
});
});
app.get('/done', function(request, response) { 
	{response.send('Order done');}  
  });

//tim
app.get('/tim',(req, res) => {
  let sql = "SELECT * FROM accounts";
  let query = connection.query(sql, (err, rows) => {
      if(err) throw err;
      res.render('tim', {
          title : 'Team', 
          accounts : rows
      });
  });
});

app.get('/delete2/:userId',(req, res) => {
  const userId = req.params.userId;
  let sql = `DELETE from accounts where id = ${userId}`;
  let query = connection.query(sql,(err, result) => {
      if(err) throw err;
      res.redirect('/tim');
  });
});

app.get('/addtim',(req, res) => {
  res.render('addtim', {
  });
});

app.post('/add',(req, res) => { 
  let data = {username: req.body.username, email: req.body.email, password: req.body.password};
  let sql = "INSERT INTO accounts SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/tim');
    
  });
});



// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
