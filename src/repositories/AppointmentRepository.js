import Appointment from "../models/Appointment.js";

const getAllAppointments = async () => {
    return await Appointment.find();
}

const getAppointment = async (id) => {
    try {
        return await Appointment.findById(id);
    } catch (error) {
        throw new Error(error);
    }
}

const saveAppointment = async ({ date, doctorid, Patientid }) => {
    try {
        const prescription = new Appointment({ date, doctorid, Patientid });
        return await prescription.save();
    } catch (error) {
        throw new Error(error);
    }
}

const updateAppointment = async (id, { date, doctorid, Patientid }) => {
    try {
        return await Appointment.findByIdAndUpdate(id, { date, doctorid, Patientid }, { new: true });
    } catch (error) {
        throw new Error(error);
    }
}

const deleteAppointment = async (id) => {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}

const appointmentRepository = {
    getAllAppointments,
    getAppointment,
    saveAppointment,
    updateAppointment,
    deleteAppointment
}

export default appointmentRepository;