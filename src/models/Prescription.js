import mongoose from "mongoose";

const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    date: {
        type: Date,
        //required: [false, 'Date not is required']
    },
    appointmentid: {
        type: String,
        required: [true, 'Apponintment is required']
    },
    medicine: {
        type: String,
        required: [true, 'Medicine is required']
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required']
    },
    instructions: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    file: {
        type: String
    }
}
);

const prescription = mongoose.model('Prescription', prescriptionSchema);

export default prescription; 