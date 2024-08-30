import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/middlewares.js";
import sessionControllers from "../controllers/session.controllers.js";

const router = Router();

router.post("/register", passportCall("register"), sessionControllers.newUser);
  

router.post("/login", passportCall("login"), sessionControllers.loginUser);


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    session: false,
  }), sessionControllers.loginGoogle);

router.get("/current", passportCall("current"), sessionControllers.currentSession);

export default router;




