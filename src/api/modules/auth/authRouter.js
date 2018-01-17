import controller from "./authController";
import {checkAuthentication, MustBeLoggedIn, MustNotBeLoggedIn} from '../../middlewares/auth';

export default router => {
    
    router.post("/sign-in", MustNotBeLoggedIn, controller.signIn);

    router.post("/sign-up", MustNotBeLoggedIn, controller.signUp);
};
