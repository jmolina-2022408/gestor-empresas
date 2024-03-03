'use strict'

import { checkUpdate } from '../utils/validator.js'
import Category from './category.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'Test category is running' })
}

//save category
export const createCategory = async (req, res) => {
    try {
        //capturar body
        let data = req.body
        //Crear instancia 
        let category = new Category(data)
        //Guardar la categoria
        await category.save()
        //responder si sale bien
        return res.send({ message: 'Category saved succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving category' })
    }
}

export const getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        if (!categories) return res.status(404).send({ message: 'Categories not found' })
        return res.send({ categories })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting categories' })
    }
}

export const editCategory = async (req, res) => {
    try {
        //obetener id categoria
        let { id } = req.params
        //obtener datos a actualizar
        let data = req.body
        //validar si tiene datos
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submited some data that cannot be update or missing data' })
        //actualizar db
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        //validar actualizacion
        if (!updateCategory) return res.status(404).send({ message: 'Category not found and not update' })
        //responder al usuario
        return res.send({ message: 'Category updated', updateCategory })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating category' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        //tener el id
        let { id } = req.params
        //Eliminar
        let deleteCategory = await Category.findOneAndDelete({ _id: id })
        // ver que si se elimino
        if (!deleteCategory) return res.status(404).send({ message: 'Category not found and not deleted' })
        // responder si sale bien
        return res.send({ message: `Category ${deleteCategory.name} deleted succesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}
