var express=require('express');
var fs=require('fs');
var app=express();
var db=require('./db.json');
var db=require('./node.js');
var reg=require('./reg.json');
var bodyParser=require('body-parser');
app.use(express.static('public'));

var urlencodedParser=bodyParser.urlencoded({extend:false});

app.get('/', function (req, res) {
   res.send('Hello World');
})
app.get('/index.html',function(req,res){
	res.sendFile(__dirname+"/"+"index.html");
})
app.get('/tableList.html',function(req,res){
	res.sendFile(__dirname+"/"+"tableList.html");
})
app.get('/ajax.html',function(req,res){
	res.sendFile(__dirname+"/"+"ajax.html");
})
app.get('/test.asp',function(req,res){
	res.sendFile(__dirname+"/"+"test.asp");
})
app.post('/test.asp',function(req,res){
	res.sendFile(__dirname+"/"+"test.asp");
})
app.get('/res.txt',function(req,res){
	res.sendFile(__dirname+"/"+"res.txt");
})
app.post('/db.json',function(req,res){
	res.sendFile(__dirname+"/"+"db.json");
})
//用户登录
app.get('/process_get',function(req,res){
	res.write('<head><meta charset="utf-8"/></head>'); 
	// 输出JSON格式
	var log_res={
		"log_name":req.query.log_name,
		"log_pass":req.query.log_pass
	};
    var user=JSON.stringify(reg);
    var log_data=JSON.parse(user);
	for(var i=0;i<log_data.user.length;i++){
		if(log_res.log_name==log_data.user[i].name && log_res.log_pass==log_data.user[i].password){
			console.log("我成功了"+i);
	        res.end("登录成功");
		}	
	}
	res.end("用户名或密码错误");
})

// 用户注册
app.post('/process_post',urlencodedParser,function(req,res){
	res.write('<head><meta charset="utf-8"/></head>');  
	var reg_res={
		"name":req.body.reg_name,
		"password":req.body.reg_pass,
		"pass_sec":req.body.reg_pass_sec
	}
	if(reg_res.name!=''&&reg_res.password!=''&&reg_res.password===reg_res.pass_sec){
		reg.user[reg.user.length]={"id":reg.user.length,"name":reg_res.name,"password":reg_res.password};
		var rest_reg=JSON.stringify(reg);
		fs.writeFile('./reg.json',rest_reg);
		res.end("恭喜您，注册成功！");
	}
	else{
		res.end("对不起，注册失败！");
	}
})
// table操作 添加数据
app.get('/table_get',urlencodedParser,function(req,res){ 
	fs.readFile( __dirname + "/" + "db.json", 'utf8', function (err, data) {
	data = JSON.parse( data );
	var addUserInput={
		"name":req.query.add_name,
		"pass":req.query.add_pass
	}
	data.user[data.user.length]={"id":data.user.length,"name":addUserInput.name,"password":addUserInput.pass};
	var addUser=JSON.stringify(data);
	fs.writeFile('./db.json',addUser);
	//console.log(addUser);
	res.send("success");
   });
})
// 删除数据
app.get('/table_del',function(req,res){
	fs.readFile( __dirname + "/" + "db.json", 'utf8', function (err, data) {
		data = JSON.parse( data );
		for(i=0;i<data.user.length;i++){
			var checkName="req.query.check"+data.user[i].id;
			var obj=eval("("+checkName+")");
			if(obj=="on"){
				delete data.user[i].name;
				delete data.user[i].password;
			}

		}
      var newJson=JSON.stringify(data);          
       fs.writeFile("./db.json",newJson)
       res.end("success"); 
   });
})
// 修改数据
app.get('/table_mod',function(req,res){
	fs.readFile( __dirname + "/" + "db.json", 'utf8', function (err, data) {
		data = JSON.parse( data );
		for(i=0;i<data.user.length;i++){
			var checkName="req.query.check"+data.user[i].id;
			var obj=eval("("+checkName+")");
			if(obj=="on"){
				data.user[i].name=req.query.mod_name;
				data.user[i].password=req.query.mod_pass;
				//console.log(data.user[i].name);
			}
	    }
      var newJson=JSON.stringify(data);          
       fs.writeFile("./db.json",newJson)
       res.end("success"); 
   });
})

var server=app.listen(8080,function(){
	var host=server.address().address;
	var port=server.address().port;
	console.log("启动成功",port);
})