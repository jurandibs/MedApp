import Patient from "../models/Patient.js"; // Corrigido "Patient" para "Patient" se for o caso

const getAllPatients = async () => {
    try {
        const patients = await Patient.find();
        return patients;
    } catch (error) {
        throw new Error(`Failed to fetch all patients: ${error.message}`);
    }
};

const getPatient = async (id) => {
    try {
        const patient = await Patient.findById(id);
        return patient; // Retorna null se não encontrado, tratado no service
    } catch (error) {
        throw new Error(`Failed to fetch patient with id ${id}: ${error.message}`);
    }
};

const savePatient = async ({ name, birthDate, email, phone }) => {
    try {
        const patient = new Patient({
            name,
            birthDate,  // Mantido como "birthdate" para consistência com o parâmetro
            email,
            phone
        });
        const savedPatient = await patient.save();
        return savedPatient;
    } catch (error) {
        throw new Error(`Failed to save patient: ${error.message}`);
    }
};

const updatePatient = async (id, { name, birthdate, email, phone }) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            { name, birthdate, email, phone },
            {
                new: true,      // Retorna o documento atualizado
                runValidators: true // Executa validações do schema
            }
        );
        return updatedPatient; // Retorna null se não encontrado
    } catch (error) {
        throw new Error(`Failed to update patient with id ${id}: ${error.message}`);
    }
};

const deletePatient = async (id) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(id); // Corrigido de findByIdAndUpdate para findByIdAndDelete
        return deletedPatient; // Retorna o documento deletado ou null se não encontrado
    } catch (error) {
        throw new Error(`Failed to delete patient with id ${id}: ${error.message}`);
    }
};

const patientRepository = {  // Corrigido "patientRepository" para "patientRepository"
    getAllPatients,
    getPatient,
    savePatient,
    updatePatient,
    deletePatient
};

export default patientRepository;