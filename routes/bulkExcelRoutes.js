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

routes.get('/', TokenVerify, ExcelFileController.GetAllData);

routes.put('/start', TokenVerify, ExcelFileController.StartCall);

routes.put('/dnd/:id', TokenVerify, ExcelFileController.DNDMode);

routes.put('/pause/:id', TokenVerify, ExcelFileController.PauseCall);

routes.delete('/:id', TokenVerify, ExcelFileController.Delete);

routes.get('/latest', TokenVerify, ExcelFileController.LatestInfo);

routes.get('/history', TokenVerify, ExcelFileController.CallHistory);

routes.put('/reschedual/:id', TokenVerify, ExcelFileController.Reschedual);

module.exports = routes