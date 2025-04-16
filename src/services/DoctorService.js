import DoctorRepository from "../repositories/DoctorRepository.js";
import bcrypt from 'bcrypt'; // Adicione esta importação

// Variável para desabilitar o bcrypt
const DESABILITAR_BCRYPT = process.env.DESABILITAR_BCRYPT === 'true';

const getAllDoctors = async () => {
    return DoctorRepository.getAllDoctors();
};

const getDoctor = async (id) => {
    return DoctorRepository.getDoctor(id);
};

const saveDoctor = async ({ name, login, password, medicalSpecialty, medicalRegistration, email, phone }) => {
    let finalPassword = password;

    if (!DESABILITAR_BCRYPT) {
        // Gera o hash da senha com bcrypt
        const salt = await bcrypt.genSalt(10);
        finalPassword = await bcrypt.hash(password, salt);
    }
    // Se DESABILITAR_BCRYPT for true, a senha será salva em texto puro
    return DoctorRepository.saveDoctor({
        name,
        login,
        password: finalPassword,
        medicalSpecialty,
        medicalRegistration,
        email,
        phone
    });
};

const updateDoctor = async (id, { name, login, password, medicalSpecialty, medicalRegistration, email, phone }) => {
    let finalPassword = password;

    if (!DESABILITAR_BCRYPT && password) {
        // Gera o hash da senha apenas se uma nova senha for fornecida
        const salt = await bcrypt.genSalt(10);
        finalPassword = await bcrypt.hash(password, salt);
    }
    // Se DESABILITAR_BCRYPT for true ou nenhuma senha for fornecida, usa o valor como está
    return DoctorRepository.updateDoctor(id, {
        name,
        login,
        password: finalPassword,
        medicalSpecialty,
        medicalRegistration,
        email,
        phone
    });
};

const deleteDoctor = async (id) => {
    return DoctorRepository.deleteDoctor(id);
};

// Login
const getDoctorByLogin = async (login) => {
    return await DoctorRepository.getDoctorByLogin(login);
};

const doctorService = {
    getAllDoctors,
    getDoctor,
    saveDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorByLogin
};

export default doctorService;