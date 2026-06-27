const joi = require('joi');


const validateInventoryCreate = joi.object({
    item_name:joi.string().trim().min(1).max(255).required(),
    sku:joi.string().trim().max(100).allow(null,""),
    quantity: joi.number().integer().min(0).required(),
    cost_price: joi.number().min(0).required(),
    selling_price: joi.number().min(0).required(),
    minimum_stock: joi.number().integer().min(0).required(),
    image_url: joi.string().uri().allow(null,""),
})

const validateAddStock = joi.object({
    quantity:joi.number().integer().positive().required()
})

const validateReduceStock = joi.object({
    quantity:joi.number().integer().positive().required()
})

module.exports = {validateInventoryCreate,validateAddStock,validateReduceStock};