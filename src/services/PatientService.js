import PatientRepository from "../repositories/PatientRepository.js"; // Corrigido "Patient" para "Patient"

const getAllPatients = async () => {  // Corrigido "Patients" para "Patients"
    try {
        return await PatientRepository.getAllPatients();  // Adicionado "await" para chamar a função
    } catch (error) {
        throw new Error(`Service error fetching all patients: ${error.message}`);
    }
};

const getPatient = async (id) => {  // Corrigido "Patient" para "Patient"
    try {
        if (!id) throw new Error('Patient ID is required');
        return await PatientRepository.getPatient(id);
    } catch (error) {
        throw new Error(`Service error fetching patient with id ${id}: ${error.message}`);
    }
};

const savePatient = async ({ name, birthDate, email, phone }) => {  // Corrigido "Patient" para "Patient"
    try {
        if (!name || !birthDate) {
            throw new Error('Name and birthdate are required');
        }
        return await PatientRepository.savePatient({ name, birthDate, email, phone });
    } catch (error) {
        throw new Error(`Service error saving patient: ${error.message}`);
    }
};

const updatePatient = async (id, { name, birthdate, email, phone }) => {  // Corrigido "Patient" para "Patient"
    try {
        if (!id) throw new Error('Patient ID is required');
        return await PatientRepository.updatePatient(id, { name, birthdate, email, phone });
    } catch (error) {
        throw new Error(`Service error updating patient with id ${id}: ${error.message}`);
    }
};

const deletePatient = async (id) => {  // Corrigido "Patient" para "Patient"
    try {
        if (!id) throw new Error('Patient ID is required');
        return await PatientRepository.deletePatient(id);
    } catch (error) {
        throw new Error(`Service error deleting patient with id ${id}: ${error.message}`);
    }
};

const patientService = {  // Corrigido "patientService" para "patientService"
    getAllPatients,  // Nomes atualizados para consistência
    getPatient,
    savePatient,
    updatePatient,
    deletePatient
};

export default patientService;