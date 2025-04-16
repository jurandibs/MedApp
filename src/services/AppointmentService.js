import AppointmentRepository from "../repositories/AppointmentRepository.js";

const getAllAppointments = async () => {
    return await AppointmentRepository.getAllAppointments();
}

const getAppointment = async (id) => {
    return await AppointmentRepository.getAppointment(id);
}

const saveAppointment = async ({ date, doctorid, Patientid }) => {
    return await AppointmentRepository.saveAppointment({ date, doctorid, Patientid });
}

const updateAppointment = async (id, { date, doctorid, Patientid }) => {
    return await AppointmentRepository.updateAppointment(id, { date, doctorid, Patientid });
}

const deleteAppointment = async (id) => {
    return await AppointmentRepository.deleteAppointment(id);
}

const appointmentService = {
    getAllAppointments,
    getAppointment,
    saveAppointment,
    updateAppointment,
    deleteAppointment
}

export default appointmentService;