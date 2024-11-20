import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preference = new Preference(client);

export const createPreference = async (preferenceData) => {
    try {
        console.log('Creating preference with items:', JSON.stringify(preferenceData, null, 2));

        const response = await preference.create({ body: preferenceData });

        console.log('Preference created successfully:', JSON.stringify(response, null, 2));

        if (!response || !response.id) {
            throw new Error('Respuesta inválida: falta el ID de preferencia');
        }

        return response;
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        throw error;
    }
};

export const fetchPreference = async (preferenceId) => {
    try {
        const response = await preference.get({ preferenceId });
        if (!response) throw new Error('Error al obtener la preferencia');
        return response;
    } catch (error) {
        console.error("Error al obtener la preferencia:", error);
        return null;
    }
};

export { preference };