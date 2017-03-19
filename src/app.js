var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var i18n = require('i18n');
var flash = require('connect-flash');
var validate = require('validate.js');
var systemConfig = require('./configs/SystemConfig');
var port = 8889;
var app = express();

/** Routes include **/
var DoctorRoute = require('./routes/Doctor');
var EWhiteBoard = require('./routes/EWhiteBoard');
var MonitorDevice = require('./routes/MonitorDevice');
var Patient = require('./routes/Patient');
var OtherFunc = require('./routes/OtherFunc');
var SystemMaintain = require('./routes/SystemMaintain');
var Marquee = require('./routes/Marquee');
var Announcement = require('./routes/Announcement');
var Todo = require('./routes/Todo');
var Nurse = require('./routes/Nurse');
var Surgery = require('./routes/Surgery');
var IndexRoute = require('./routes/Index');

var Bed = require('./routes/bed');

//SIP，定時排程抓資料的LIB
var sipSchedule = require('node-schedule');
//定時抓排程資料的主程式
var cronSchedule =require('./services/cronService');


//安裝精靈
var Installer = require('./routes/Installer');

//與HIS溝通的中繼API
var MiddleAPI = require('./routes/MiddleAPI');

var os =require("os"); console.log("os is :"+ os.platform());

/** open sql pool **/
require("./plugins/mysql/DB").create();

/** i18n configure **/
i18n.configure({
  locales:['zh_tw' ,'zh_cn'],
  defaultLocale : 'zh_cn',
  cookie: systemConfig.secret + 'i18n',
  directory: __dirname + '/locales'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || port );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(systemConfig.secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: systemConfig.secret,          // 防止cookie竊取
  proxy: true,                          //安全cookie的反向代理，通过x-forwarded-proto實現
  resave: false ,                       //即使 session 没有被修改，也保存 session 值，預設為 true。
  saveUninitialized: true,              //是指無論有没有session cookie，每次请求都設置個session cookie ，預設為 connect.sid
  cookie : {maxAge :  60 * 60 *1000}  //session的cookie配置，預設 {path: ‘/’, httpOnly: true, maxAge: null}
  //activeDuration: 1 * 60 * 1000
}));


app.use(i18n.init);
app.use(flash());

app.use(function(req, res, next){

  res.locals.session = req.session;
  res.locals.locale = req.session.locale;

  next();

});

/** routers **/
app.use('/Bed', Bed);
app.use('/doctor', DoctorRoute);
app.use('/eWhiteBoard', EWhiteBoard);
app.use('/monitor', MonitorDevice);
app.use('/patient', Patient);
app.use('/nurse', Nurse);
app.use('/other', OtherFunc);
app.use('/systemMaintain', SystemMaintain);
app.use('/marquee', Marquee);
app.use('/announcement', Announcement);
app.use('/todo', Todo);
app.use('/nurse', Nurse);
app.use('/surgery', Surgery);

//安裝精靈路徑
app.use('/installer', Installer);


//與HIS的中繼API路徑
app.use('/middleAPI', MiddleAPI);

//網站首頁
app.use('/', IndexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.        status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//定時抓取sip的通聯紀錄
cronSchedule.SIPRecordStart();





http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + app.get('port'));
});

