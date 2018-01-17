import controller from "./userController";
import {checkAuthentication, MustBeLoggedIn, MustBeSuperAdmin} from '../../middlewares/auth';

export default router => {
    
    router.use(checkAuthentication);

    router.get("/", MustBeSuperAdmin, controller.getAllUsers);

    router.get("/:id", MustBeLoggedIn, controller.GetUser);

    router.post("/", MustBeSuperAdmin, controller.CreateUser);

    router.put("/:id", MustBeLoggedIn, controller.UpdateUser);

    router.delete("/:id", MustBeLoggedIn ,controller.DeleteUser);

};
