import express from "express";
import AppointmentService from "../services/AppointmentService.js";

const router = express.Router();

// GET all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await AppointmentService.getAllAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET appointment by ID
router.get('/appointments/:id', async (req, res) => {  // Corrigido para "/appointments/:id"
    const { id } = req.params;
    try {
        const appointment = await AppointmentService.getAppointment(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new appointment
router.post('/appointments', async (req, res) => {  // Corrigido para "/appointments"
    const { date, doctorid, Patientid } = req.body;  // Corrigido "patientId" para "Patientid"
    try {
        if (!date || !doctorid || !Patientid) {
            return res.status(400).json({ error: 'Date, doctorid, and Patientid are required' });
        }
        const appointment = await AppointmentService.saveAppointment({ date, doctorid, Patientid });
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update appointment
router.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { date, doctorid, Patientid } = req.body;
    try {
        // Validação: pelo menos um campo deve ser fornecido
        if (!date && !doctorid && !Patientid) {
            return res.status(400).json({ error: 'At least one field (date, doctorid, or Patientid) is required' });
        }

        // Converte date para formato Date, se fornecido
        const updateData = {
            ...(date && { date: new Date(date) }), // Converte para Date
            ...(doctorid && { doctorid }),
            ...(Patientid && { Patientid }),
        };

        const appointment = await AppointmentService.updateAppointment(id, updateData);
        //console.log(`Resultado da atualização para ${id}:`, appointment); // Log do resultado
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(`Error updating appointment ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// DELETE appointment
router.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await AppointmentService.deleteAppointment(id);
        if (!result) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(204).send();  // No content para DELETE bem-sucedido
    } catch (error) {
        console.error(`Error deleting appointment ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT reschedule appointment
router.put('/appointments/:id/reschedule', async (req, res) => {  // Ajustado caminho para maior clareza
    const { id } = req.params;
    const { date } = req.body;
    try {
        if (!date) {
            return res.status(400).json({ error: 'New date is required' });
        }
        const appointment = await AppointmentService.updateAppointment(id, { date });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error(`Error rescheduling appointment ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;