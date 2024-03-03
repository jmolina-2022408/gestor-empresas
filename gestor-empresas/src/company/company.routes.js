'use strict'

import { Router } from 'express'
import { test, orderAZ, orderZA, createCompany, editCompany, orderAge, generateReport } from './company.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', [validateJwt], test)
api.post('/createCompany', [validateJwt, isAdmin], createCompany)
api.get('/orderAZ', [validateJwt, isAdmin], orderAZ)
api.get('/orderZA', [validateJwt, isAdmin], orderZA)
api.get('/orderAge', [validateJwt, isAdmin], orderAge)
api.put('/editCompany/:id', [validateJwt, isAdmin], editCompany)
api.get('/generateReport', [validateJwt, isAdmin], generateReport)

export default api