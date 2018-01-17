import * as express from 'express';

import AuthModule from './modules/auth/authModule';
import UserModule from './modules/user/userModule';

export default (router) => {
    let modules = [];

    let auth = AuthModule(router);
    let user = UserModule(router);

    modules.push(auth);
    modules.push(user);

    console.log(`loading modules`);
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};
