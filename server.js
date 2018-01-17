import App from './src/app';
import http from 'http';
import config from './src/api/config';

const server = http.createServer(App());
server.listen(config.app.port,function(){
    console.log('api listening at http://%s:%s', server.address().address, server.address().port); 
});




