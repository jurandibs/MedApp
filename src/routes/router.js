import express from "express";
import appointmentController from "./AppointmentController.js";
import doctorController from "./DoctorController.js";
import patientController from "./PatientController.js";
import prescriptionController from "./PrescriptionController.js";
import doctorService from "../services/DoctorService.js";
//import bcrypt from 'bcrypt';
import verifyToken from "../middleware/authmiddleware.js";
import jwt from 'jsonwebtoken';


const router = express.Router();

router.get(
    "/", function (req, res) {
        console.log("hi");
        res.status(200).json({ message: "hi!" });
    }
);

//mapeamento do login
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const doctor = await doctorService.getDoctorByLogin(login);
        if (!doctor) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        //const passwordMatch = await bcrypt.compare(password, doctor.password);
        const passwordMatch = password === doctor.password;
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });

        }

        const token = jwt.sign({ doctorid: doctor._id }, 'you-secret-key', {
            expiresIn: '1h',
        });
        res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'invalid token!' });

    }
})

router.use("/", verifyToken, appointmentController);
router.use("/", verifyToken, doctorController);
router.use("/", verifyToken, patientController);
router.use("/", verifyToken, prescriptionController);

export default router;