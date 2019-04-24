if (!process.env.CI) require('dotenv').config();

var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
 
var config = {
    user: process.env.FTPUSERNAME,
    password: process.env.FTPPASS,
    host: process.env.FTPHOST,
    port: 3201,
    secure: 'implicit',
    localRoot: __dirname + "/../distAssets/",
    remoteRoot: process.env.ASSETS_DEST,
    include: ['*']
}

ftpDeploy.on('upload-error', function (data) {
    console.log(data.err);
});

ftpDeploy.deploy(config, function(err) {
    if (err) console.log(err)
    else console.log('finished');
});