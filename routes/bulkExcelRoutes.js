const express = require('express');

const routes = express.Router();
const multer = require('multer');
const path = require('path');

const ExcelFileController = require('../controller/bulkexcelController');
const TokenVerify = require('../middelware/companyToken');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


// File filter to accept only Excel files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

routes.post('/', TokenVerify, upload.single('excelfile'), ExcelFileController.AddExcelFile)

routes.post('/manually', TokenVerify, ExcelFileController.AddManually);

routes.get('/', ExcelFileController.GetAllData);

routes.put('/start/:id', ExcelFileController.StartCall);

routes.put('/dnd/:id', ExcelFileController.DNDMode);

routes.put('/pause/:id', ExcelFileController.PauseCall);

routes.delete('/:id', ExcelFileController.Delete);

routes.get('/latest', ExcelFileController.LatestInfo);

routes.get('/history', ExcelFileController.CallHistory);

module.exports = routes