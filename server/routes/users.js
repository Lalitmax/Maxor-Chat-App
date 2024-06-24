import express from 'express';
import authControllers from '../controller/authController.js';
import userController from '../controller/userController.js';
import getFriends from '../controller/getFriendsController.js'
import getSpecificUserData from '../controller/getSpecificUserDataController.js';
import isUserExistOrNot from '../controller/usernameExistOrNotController.js'
import deleteFriend from '../controller/deleteFriendController.js'
import helloChatApp from '../controller/helloChatAppController.js'
const router  = express.Router();

router.post('/auth/register', authControllers.register)
router.post('/auth/login', authControllers.login)
router.post('/user',userController);
router.delete('/deleteFriend',deleteFriend);
router.get('/isUserExistOrNot',isUserExistOrNot);
router.get('/getSpecificUserData',getSpecificUserData);
router.get('/getFriends',getFriends);
router.get('/helloChatApp',helloChatApp);



export default router;