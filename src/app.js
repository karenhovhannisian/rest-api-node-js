import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import path from 'path';
import expressValidator  from 'express-validator';

import enableRoutes from './api';
import config from './api/config';
import {BAD_REQUEST_CODE} from "./api/config/status-codes";

class Application {
    app;
    router;
    mongoClient;

    constructor () {
        this.app = express();
        this.initApp();
    }
    initApp() {
        this.configApp();
        this.dbConfig();
        this.setParams();
        this.setRouter();
        this.setErrorHandler();
    }

    configApp() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        
        this.app.use(expressValidator());
        this.app.use((req,res,next)=>{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        this.app.use(express.static(path.join(__dirname,'../','public')));
    }

    dbConfig() {
        
        mongoose.Promise = global.Promise;
        const connection = mongoose.connection;
        
        connection.on('error', function(error) {
            console.error('Error in MongoDb connection: ' + error);
            mongoose.disconnect();
        });
        connection.once('open', function() {
            console.log('connection open');
        });
        connection.on('connected', function() {
            console.log('connected!');
        });
        connection.on('reconnected', function () {
            console.log('reconnected');
        });
        connection.on('disconnected', function() {
            console.log('disconnected');
            console.log('dbURI is: '+ config.dbConnectUrl);
            mongoose.connect(config.dbConnectUrl , {useMongoClient: true, autoReconnect: true});
        });

        this.mongoClient = mongoose.connect(config.dbConnectUrl,{useMongoClient: true});
    }

    setParams() {
        this.app.set('port', process.env.PORT || 5000);//it not use port coming from config
    }

    setRouter() {
        this.router = express.Router();
        this.app.use('/api',enableRoutes(this.router));
    }

    setErrorHandler() {
        this.app.use((err, req, res, next) => {
            let status = err.status || BAD_REQUEST_CODE;

            return res.status(status).json({
                status: status,
                data: null,
                message: err.message || '',
                errors: err.errors || null
            });
        });
    }
}

export default () => new Application().app;
