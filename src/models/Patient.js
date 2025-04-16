import mongoose from "mongoose";

const Schema = mongoose.Schema;

const patientSchema = new Schema({  // Corrigido "patientSchema" para "patientSchema"
    name: {
        type: String,
        required: [true, 'Patient name is required'],  // Corrigido "Patient" para "Patient"
        trim: true  // Remove espaços em branco extras
    },
    birthDate: {
        type: Date,
        required: [true, 'Birth date is required'],  // Descomentei e corrigi "Birth Date" para "Birth date"
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,  // Converte para minúsculas
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']  // Validação básica de email
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{2} 9\d{4}-\d{4}$/.test(v);  // Corrigido regex para formato "99 91234-5678"
            },
            message: props =>
                `${props.value} is not a valid phone number. Please use the format "99 91234-5678"`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true  // Impede alterações após criação
    }
}, {
    timestamps: true  // Adiciona createdAt e updatedAt automaticamente
});

const Patient = mongoose.model('Patient', patientSchema);  // Corrigido "patient" para "Patient"

export default Patient;