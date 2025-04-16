import Prescription from "..//models/Prescription.js";

const getAllPrescriptions = async () => {
    try {
        return await Prescription.find();
    } catch (error) {
        throw new Error(error);
    }

}

const getPrescription = async (id) => {
    try {
        return await Prescription.findById(id);
    } catch (error) {
        throw new Error(error);
    }
}

const savePrescription = async ({ date, appointmentid, medicine, dosage, instructions }) => {
    try {
        const prescription = new Prescription({ date, appointmentid, medicine, dosage, instructions });
        return await prescription.save();
    } catch (error) {
        throw new Error(error);
    }
}

const updatePrescription = async (id, { date, appointmentid, medicine, dosage, instructions, file }) => {
    try {
        return await Prescription.findByIdAndUpdate(id, { date, appointmentid, medicine, dosage, instructions, file }, { new: true });
    } catch (error) {
        throw new Error(error);
    }
}

const deletePrescription = async (id) => {
    try {
        return await Prescription.findByIdAndUpdate(id);
    } catch (error) {
        throw new Error(error);
    }
}

const prescriptionRepository = {
    getAllPrescriptions,
    getPrescription,
    savePrescription,
    updatePrescription,
    deletePrescription
}

export default prescriptionRepository;