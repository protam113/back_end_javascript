import express from "express";
import {
    addNewAdmin,
    addNewManager,
    deleteManager,
    deleteUsers,
    getAllAdmin,
    getAllManagers,
    getAllUser,
    getUserDetails,
    login,
    logoutAdmin,
    logoutUser,
    userRegister,
} from "../controllers/userController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// auth
router.post("/register", userRegister);
router.post("/login", login);

// admin
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin)
router.get("/admin/me", isAdminAuthenticated, getUserDetails)
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin)
router.get("/admin/getall", isAdminAuthenticated, getAllAdmin)

//user
router.get("/user/me", isUserAuthenticated, getUserDetails)
router.get("/user/logout", isUserAuthenticated, logoutUser)
router.get("/user/info", isAdminAuthenticated, getAllUser)
router.delete('/user/delete/:id', isAdminAuthenticated, deleteUsers);

//manager
router.get("/managers", getAllManagers)
router.post("/manager/addnew", isAdminAuthenticated, addNewManager)
router.delete('/manager/delete/:id', isAdminAuthenticated, deleteManager);




export default router;