const express = require('express');
const { AttendanceLoginTime,AttendanceLogoutTime,AttendanceGetAttendanceByUserId,getAllAttendanceUserById } = require('../../controllers/Attendance/Attendance.controller');
const router = express.Router();

router.post('/login', AttendanceLoginTime);

router.put('/logout/:id', AttendanceLogoutTime);

router.get('/user/:user_id', AttendanceGetAttendanceByUserId);

router.get('/user/all/:user_id', getAllAttendanceUserById);





module.exports = router;