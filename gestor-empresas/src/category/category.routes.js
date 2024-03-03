import express from 'express'
import { test, deleteCategory, createCategory, getAllCategories, editCategory } from './category.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = express.Router();

api.get('/test', [validateJwt, isAdmin], test)
api.post('/createCategory', [validateJwt, isAdmin], createCategory)
api.delete('/deleteCategory/:id', [validateJwt, isAdmin], deleteCategory)
api.get('/getAllCategories', [validateJwt, isAdmin], getAllCategories)
api.put('/editCategory/:id', [validateJwt, isAdmin], editCategory)

export default api