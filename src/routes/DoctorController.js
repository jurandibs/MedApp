import express from "express";
import bcrypt from "bcrypt";
import DoctorService from "../services/DoctorService.js";

const router = express.Router();

// GET all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await DoctorService.getAllDoctors();  // Corrigido de "getAllAppointments" para "getAllDoctors"
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET doctor by ID
router.get('/doctors/:id', async (req, res) => {  // Corrigido "/getdoctor" para "/doctors/:id"
    const { id } = req.params;
    try {
        const doctor = await DoctorService.getDoctor(id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error(`Error fetching doctor ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new doctor
router.post('/doctors', async (req, res) => {  // Corrigido "/postDoctor" para "/doctors"
    const { name, login, password, medicalSpecialty, medicalRegistration, email, phone } = req.body;
    try {
        if (!name || !login || !password || !medicalSpecialty || !medicalRegistration || !email) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = await DoctorService.saveDoctor({
            name,
            login,
            password: hashedPassword,
            medicalSpecialty,
            medicalRegistration,
            email,
            phone
        });
        res.status(201).json(doctor);
    } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: 'Failed to register doctor' });
    }
});

// PUT update doctor
router.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, login, password, medicalSpecialty, medicalRegistration, email, phone } = req.body;
    try {
        let updateData = { name, login, medicalSpecialty, medicalRegistration, email, phone };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);  // Hash apenas se a senha for fornecida
        }
        const doctor = await DoctorService.updateDoctor(id, updateData);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error(`Error updating doctor ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE doctor
router.delete('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await DoctorService.deleteDoctor(id);
        if (!result) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(204).send();  // No content para DELETE bem-sucedido
    } catch (error) {
        console.error(`Error deleting doctor ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;