import PrescriptionRepository from "../repositories/PrescriptionRepository.js"
import AppointmentService from "./AppointmentService.js";
import doctorService from "./DoctorService.js";
import patientService from "./PatientService.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path"; // Adicionado para lidar com caminhos de arquivo

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllPrescriptions = async () => {
    return PrescriptionRepository.getAllPrescriptions();
}

const getPrescription = async (id) => {
    return PrescriptionRepository.getPrescription(id);
}

const savePrescription = async ({ date, appointmentid, medicine, dosage, instructions }) => {
    return PrescriptionRepository.savePrescription({ date, appointmentid, medicine, dosage, instructions });
}

const updatePrescription = async (id, { date, appointmentid, medicine, dosage, instructions, file }) => {
    return PrescriptionRepository.updatePrescription(id, { date, appointmentid, medicine, dosage, instructions, file });
}

const deletePrescription = async (id) => {
    return PrescriptionRepository.deletePrescription(id);
}

const generatePrescriptionFile = async (prescription) => {
    try {
        if (!prescription || !prescription.appointmentid) {
            throw new Error("É necessária uma prescrição válida com appointmentId");
        }

        console.log(`Buscando consulta para o ID: ${prescription.appointmentid}`);
        const appointment = await AppointmentService.getAppointment(prescription.appointmentid);
        if (!appointment) {
            console.error(`Consulta não encontrada para o ID: ${prescription.appointmentid}`);
            throw new Error("Consulta não encontrada");
        }

        const patient = await patientService.getPatient(appointment.Patientid);
        if (!patient) throw new Error("Paciente não encontrado");

        const doctor = await doctorService.getDoctor(appointment.doctorid);
        if (!doctor) throw new Error("Médico não encontrado");

        const id = prescription._id;
        const prescriptionsDir = path.join(__dirname, "../prescriptions"); // Caminho relativo ao diretório do serviço
        if (!fs.existsSync(prescriptionsDir)) {
            fs.mkdirSync(prescriptionsDir, { recursive: true }); // Cria o diretório se não existir
        }

        const filePath = path.join(prescriptionsDir, `${id}.pdf`);
        const document = new PDFDocument({ font: "Courier" });

        document.pipe(fs.createWriteStream(filePath));
        document.fontSize(12).text("Patient Name: " + patient.name);
        document.fontSize(12).text("Doctor Name: " + doctor.name);

        const recipe = "Medicine: " + prescription.medicine;
        document.fontSize(12).text(recipe);

        document.fontSize(12).text("Dose: " + prescription.dosage);
        document.fontSize(12).text("Instructions: " + prescription.instructions);

        document.end();

        return { ...prescription, filePath }; // Retorna o objeto prescription com o caminho do arquivo
    } catch (error) {
        throw new Error(`Error generating prescription file: ${error.message}`);
    }
};

const prescriptionService = {
    getAllPrescriptions,
    getPrescription,
    savePrescription,
    updatePrescription,
    deletePrescription,
    generatePrescriptionFile
}

export default prescriptionService;