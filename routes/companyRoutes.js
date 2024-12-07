const express = require('express');

const routes = express.Router();

// controllers
const CompanyController = require('../controller/companyController');
const TokenVerify = require('../middelware/superAdminToken');
const CompanyToken = require('../middelware/companyToken');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

routes.post('/', TokenVerify, upload.single('image'), CompanyController.CompanyAdd);

routes.get('/', CompanyController.GetByAllData);

routes.get('/:id', CompanyController.GetByID);

routes.put('/:id', upload.single('image'), CompanyController.Update);

routes.post('/login', TokenVerify, CompanyController.Login);

routes.post('/forget', CompanyController.ForgetPassword);

routes.post('/changepass', CompanyController.ChangePassword);

routes.put('/genralsetting/:id', CompanyToken, upload.single('image'), CompanyController.GenralSetting);

module.exports = routes    