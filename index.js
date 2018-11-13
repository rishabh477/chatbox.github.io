var express=require('express');
var path =require('path');
var sql=require('mysql');
var bodyparser=require('body-parser');
var socket=require('ws').Server;
var server=new socket({port:5000});

	server.on('connection',function(ws) {
		ws.on('message',function(msg) {
			msg=JSON.parse(msg);
			if(msg.type == "name"){
				ws.userId=msg.data;			
			}
			else if(msg.type == "message"){
				server.clients.forEach(function(user){
					if(user!=ws){
						user.send(JSON.stringify({
							name: ws.userId,
							data: msg.data
						}));
					};
				});
			}
			//ws.send("server:"+msg +"<br>");
		});
	});
	var app=express();
	app.use('/',express.static(__dirname + '/css'));
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({extended:true}));

	var con = sql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database:'users'
	});

	con.connect(function (err) {
		if(err) throw err;
		else{
			console.log('connection estd')
			}
	});

	app.get('/' , function(req,res){
		res.sendFile('login.html',{root:path.join(__dirname)});
	});

	app.get('/css/login.css' , function(req,res){
		res.sendFile('/login.css',{root:path.join(__dirname + '/css')});
	});
	/*Main Page*/
	
	/*Post request*/
	app.post('/signedin',function(req,res){
		console.log(req.body);
		var sqlQuery='INSERT INTO user SET ?';
		con.query(sqlQuery,req.body,function(err,results){
			if (err) {
				console.log(err);
			}
			console.log(results);
		});
		if(req.body.emailid=='rishabhagrawal@gmail.com' && req.body.password=='rajrishabh'){
			res.redirect('/adminpage');
			app.get('/adminpage',function(req,res){
			res.sendFile('adminpage.html',{root:path.join(__dirname)});
			});
		}
		
		else{
			res.redirect('/mainpage');
			app.get('/mainpage',function(req,res){
			res.sendFile('mainpage.html',{root:path.join(__dirname)});
			});
		}
	});

	app.listen(4000);