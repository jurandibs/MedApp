import Patient from "../../models/Patient.js";
import PatientRepository from "../../repositories/PatientRepository.js";
import db from "../database/setup.js";


const name = "Maria";
const birthDate = "1980-01-10";
const email = "maria@gg.com";
const phone = "11 98877-2201";

beforeAll(async () => {
    await db.setUp();
});

afterEach(async () => {
    await db.dropCollections();
});

afterAll(async () => {
    await db.dropDatabase();
});

describe('Patient Repository Test', () => {
    it('Should create Patient sucessfully when correct values are inserted', async () => {

        const patient = new Patient({ name, birthDate, email, phone });

        const expectedPatient = await PatientRepository.savePatient(patient);

        expect(expectedPatient.name).toBe(name);
        expect(expectedPatient.birthDate.toISOString()).toBe("1980-01-10T00:00:00.000Z");
        expect(expectedPatient.email).toBe(email);
        expect(expectedPatient.phone).toBe(phone);


    });

    it('Should receive error when missing name', async () => {

        const name = null;
        const patient = new Patient({ name, birthDate, email, phone });

        expect(async () => {
            await PatientRepository.savePatient(patient);
        }).rejects.toThrow(new Error("ValidationError: name: Patient name is required."));

    });

    it('Should receive error when missing birth date', async () => {

        const birthDate = null;
        const patient = new Patient({ name, birthDate, email, phone });

        expect(async () => {
            await PatientRepository.savePatient(patient);
        }).rejects.toThrow(new Error("ValidationError: birthDate: Birth Date is required."));

    });

    it('Should receive error when missing birth date', async () => {

        const email = null;
        const patient = new Patient({ name, birthDate, email, phone });

        expect(async () => {
            await PatientRepository.savePatient(patient);
        }).rejects.toThrow(new Error("ValidationError: email: Email contact is required."));

    });

    it('Should receive error when missing phone number', async () => {

        const phone = null;
        const patient = new Patient({ name, birthDate, email, phone });

        expect(async () => {
            await PatientRepository.savePatient(patient);
        }).rejects.toThrow(new Error("ValidationError: phone: Phone number is required."));

    });

    it('Should validate phone format', async () => {

        const phone = "11988772201";
        const patient = new Patient({ name, birthDate, email, phone });

        expect(async () => {
            await PatientRepository.savePatient(patient);
        }).rejects.toThrow(new Error("ValidationError: phone: 11988772201 This is not a valid phone value. Please use the following format 99 91234-4567"));

    });

});