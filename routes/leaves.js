const express = require('express')
const router = express.Router()

const {
    getLeaves,
    applyLeave,
    getUserLeaves
} = require('../controllers/leaveController')


router.get('/', getLeaves)
router.post('/create', applyLeave)
router.get('/userLeaves', getUserLeaves)

module.exports = router