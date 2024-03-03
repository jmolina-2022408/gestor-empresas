'use strict'

import Company from './company.model.js '
import Category from '../category/category.model.js'
import { checkUpdate } from '../utils/validator.js'
import ExcelJS from 'exceljs'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'Test company is running' })
}

export const createCompany = async (req, res) => {
    try {
        //capturar la data
        let data = req.body
        //validar que la categoria exista


        let category = await Category.findOne({ _id: data.category })

        if (!category) return res.send({ message: 'Category not found or not exist' })
        //crear instancia company
        let company = new Company(data)
        await company.save()

        //responder al usuario
        return res.send({ message: 'Company saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving company' })
    }
}

export const orderAZ = async (req, res) => {
    try {
        let company = await Company.find().sort({ name: 1 })
        return res.send({ company })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordening companies' })
    }
}

export const orderZA = async (req, res) => {
    try {
        let company = await Company.find().sort({ name: -1 })
        return res.send({ company })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordening companies' })
    }
}

export const orderAge = async (req, res) => {
    try {
        let company = await Company.find().sort({ age: -1 })
        return res.send({ company })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordening companies' })
    }
}


export const editCompany = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id de la empresa a actualizar
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        //Actualizar
        let updateCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category', ['name']) //Eliminar la información sensible
        //Validar la actualización
        if (!updateCompany) return res.status(404).send({ message: 'Company not found and not updated' })
        //Responder si todo sale bien
        return res.send({ message: 'Company updated successfully', updateCompany })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating company' })
    }
}

export const generateReport = async (req, res) => {
    try {
        // Obtener todas las empresas registradas
        let company = await Company.find();

        // Crear un nuevo libro de Excel
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Companies');

        // Definir encabezados de columna
        worksheet.addRow(['Name', 'Level of Impact', 'Years', 'Category']);

        // Agregar datos de empresas al archivo Excel
        company.forEach(company => {
            worksheet.addRow([
                company.name,
                company.impact,
                company.age,
                company.category
            ]);
        });

        // Escribir el archivo Excel en un buffer
        let excel = await workbook.xlsx.writeBuffer();

        // Establecer encabezados de respuesta para indicar que se está enviando un archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=empresas.xlsx');

        // Enviar el buffer del archivo Excel como respuesta
        res.send(excel);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error generating excel report' });
    }
};