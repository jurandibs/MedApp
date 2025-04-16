import express from "express";
import PatientService from "../services/PatientService.js";

const router = express.Router();

// GET all patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await PatientService.getAllPatients();
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET patient by ID
router.get('/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await PatientService.getPatient(id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error(`Error fetching patient ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new patient
router.post('/patients', async (req, res) => {
    const { name, birthDate, email, phone } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !birthDate) {
        return res.status(400).json({ error: 'Name and birth date are required' });
    }

    try {
        const patient = await PatientService.savePatient({
            name,
            birthDate,
            email,
            phone
        });
        res.status(201).json(patient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update patient
router.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, birthDate, email, phone } = req.body;

    try {
        const patient = await PatientService.updatePatient(id, {
            name,
            birthDate,
            email,
            phone
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        console.error(`Error updating patient ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE patient
router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PatientService.deletePatient(id);
        if (!result) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(204).send();  // No content para DELETE bem-sucedido
    } catch (error) {
        console.error(`Error deleting patient ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;