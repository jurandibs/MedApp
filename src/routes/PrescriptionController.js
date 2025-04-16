import express from "express";
import prescriptionService from "../services/PrescriptionService.js";
import multer from 'multer';
import process from "process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../prescriptions");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log(`Diretório criado: ${uploadDir}`);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Mantém o nome original do arquivo
    },
});

const upload = multer({ storage });

// Rota para upload de prescrição
router.post("/uploadprescription/:id", upload.single("file"), async (req, res) => {
    const { id } = req.params; // Declarar id fora do try para uso no catch
    try {
        console.log(`Recebendo upload para prescrição ID: ${id}`);
        console.log(`Arquivo recebido: ${req.file?.originalname || "nenhum arquivo"}`);

        // Verificar se o arquivo foi enviado
        if (!req.file) {
            console.log("Nenhum arquivo recebido na requisição");
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }

        let prescription = await prescriptionService.getPrescription(id);
        if (!prescription) {
            console.log(`Prescrição ${id} não encontrada`);
            return res.status(404).json({ error: "Prescrição não encontrada" });
        }

        const filePath = path.join(__dirname, "../prescriptions", req.file.originalname);
        console.log(`Salvando arquivo em: ${filePath}`);
        prescription = await prescriptionService.updatePrescription(id, { file: filePath });

        console.log(`Prescrição atualizada com sucesso: ${prescription._id}`);
        return res.status(200).send(prescription);
    } catch (error) {
        console.error(`Erro no upload da prescrição ${id}:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get("/readprescription/:id", async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Buscando prescrição para leitura com ID: ${id}`);
        const prescription = await prescriptionService.getPrescription(id);
        if (!prescription || !prescription.file) {
            console.log(`Prescrição ou arquivo não encontrado para ID: ${id}`);
            return res.status(404).json({ error: "Arquivo não encontrado" });
        }

        const filePath = prescription.file; // Usa o caminho absoluto já salvo
        console.log(`Enviando arquivo: ${filePath}`);

        // Verifica se o arquivo existe antes de enviar
        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo não encontrado no sistema: ${filePath}`);
            return res.status(404).json({ error: "Arquivo não encontrado no servidor" });
        }

        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                console.error(`Erro ao enviar arquivo ${filePath}:`, err);
                res.status(500).json({ error: "Erro ao enviar o arquivo" });
            } else {
                console.log(`Arquivo ${filePath} enviado com sucesso`);
            }
        });
    } catch (error) {
        console.error(`Erro ao ler prescrição ${id}:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET all prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prescriptionService.getAllPrescriptions();
        res.status(200).json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET prescription by ID
router.get('/prescriptions/:id', async (req, res) => {  // Rota corrigida para manter consistência
    const { id } = req.params;
    try {
        const prescription = await prescriptionService.getPrescription(id);
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.status(200).json(prescription);
    } catch (error) {
        console.error(`Error fetching prescription ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new prescription
router.post('/prescriptions', async (req, res) => {  // Rota corrigida para manter consistência
    const { date, appointmentid, medicine, dosage, instructions } = req.body;

    // Validação básica dos campos obrigatórios
    if (!date || !appointmentid || !medicine || !dosage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const prescription = await prescriptionService.savePrescription({
            date,
            appointmentid,
            medicine,
            dosage,
            instructions
        });
        res.status(201).json(prescription);
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT update prescription
router.put('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { date, appointmentid, medicine, dosage, instructions } = req.body;

    try {
        const prescription = await prescriptionService.updatePrescription(id, {
            date,
            appointmentid,
            medicine,
            dosage,
            instructions
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.status(200).json(prescription);
    } catch (error) {
        console.error(`Error updating prescription ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE prescription
router.delete('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prescriptionService.deletePrescription(id);
        if (!result) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        res.status(204).send();  // No content para DELETE bem-sucedido
    } catch (error) {
        console.error(`Error deleting prescription ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Geração do relatório pdf
router.get('/generatePrescription/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Buscando prescrição com ID: ${id}`);
        const prescription = await prescriptionService.getPrescription(id);
        if (!prescription) {
            console.log(`Prescrição ${id} não encontrada`);
            return res.status(404).json({ error: "Prescrição não encontrada" });
        }

        console.log(`Gerando arquivo para prescrição: ${id}`);
        const generatePrescription = await prescriptionService.generatePrescriptionFile(prescription);
        console.log(`Arquivo gerado com sucesso: ${generatePrescription.filePath}`);
        res.sendFile(generatePrescription.filePath); // Envia o arquivo diretamente
    } catch (error) {
        console.error(`Erro ao gerar prescrição ${id}:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;