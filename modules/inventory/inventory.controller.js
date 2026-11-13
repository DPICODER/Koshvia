const sequelize = require("../../core/db/database");
const inventoryService = require("./inventory.service");

exports.getInventory = async (req, res, next) => {
    try {
        const user_id = req.user.tenant_id;

        const result = await inventoryService.getUserInventory(user_id);
        if (result.length === 0) {
            return res.status(404).json({
                success: true,
                message: "Inventory Empty",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Inventory Fetched",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

exports.addToInventory = async (req, res, next) => {
    if (req.body.selling_price < req.body.cost_price) {
        return res.status(400).json({
            success: false,
            message: "Selling price cannot be less than cost price"
        })
    }
    let t;
    try {
        t = await sequelize.transaction();

        const tenant_id = req.user.tenant_id;
        const item_info = req.body;

        const result = await inventoryService.createInventoryItem(tenant_id, item_info, { transaction: t });
        await inventoryService.recordInventoryMovement(tenant_id, result.item, result.stockChange, result.operation, { transaction: t })
        await t.commit();
        return res.status(201).json({
            success: true,
            message: "added to inventroy",
        })
    } catch (error) {
        if(t && !t.finished){
            await t.rollback();
        }
        next(error)
    }
}

exports.updateEntry = async (req, res, next) => {
    let t;
    try {
        t = await sequelize.transaction();
        
        const tenant_id = req.user.tenant_id;
        const update_info = req.body;
        const item_id = req.params.id;


        const update_item = await inventoryService.updateInventoryItem(tenant_id, item_id, update_info, { transaction: t });
        await inventoryService.updateInventoryMovement(update_item.old_item, update_item.update_details, update_info, { transaction: t });

        await t.commit();
        return res.status(201).json({
            success: true,
            message: "Inventory Updated",
        })
    } catch (error) {
        if(t && !t.finished){
            await t.rollback();
        }
        next(error)
    }
}

exports.getInventoryItem = async (req, res, next) => {
    try {
        const item_id = req.params.id;
        const item = await inventoryService.getInventoryItemById(item_id, req.user.tenant_id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: `item with ${item_id} not found`
            })
        }
        return res.status(200).json({
            success: true,
            message: "item found",
            data: item
        })
    } catch (error) {
        next(error)
    }
}


exports.getInvnetoryMovement = async (req, res, next) => {
    try {
        const tenant_id = req.user.tenant_id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const result = await inventoryService.getInventoryHistory(tenant_id, limit, offset);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No movements founds"
            })
        }
        return res.status(200).json({
            success: true,
            message: "fetched movement",
            data: result
        });
    } catch (error) {
        next(error)
    }
}

exports.getInvnetoryMovementById = async (req, res, next) => {
    try {
        const tenant_id = req.user.tenant_id;
        const item_id = req.params.id;

        const result = await inventoryService.getInventoryHistoryById(tenant_id, item_id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No movement found with id : ${item_id}`
            })
        }
        return res.status(200).json({
            success: true,
            message: "fetched movement",
            data: result
        });
    } catch (error) {
        next(error)
    }
}

exports.addStock = async (req, res, next) => {
    let t;
    try {
        t = await sequelize.transaction();
        
        const tenant_id = req.user.tenant_id;
        const quantity = req.body.quantity;
        const item_id = req.params.id;
        const result = await inventoryService.adjustStock(tenant_id, item_id, quantity, "increment", { transaction: t });
        await inventoryService.recordInventoryMovement(tenant_id, result.item, result.stockChange, result.operation, { transaction: t });

        await t.commit();
        return res.status(200).json({
            success: true,
            message: "update Success",
            data: result
        });
    } catch (error) {
        if(t && t.finished){
            await t.rollback();
        }
        next(error)
    }
}
exports.reduceStock = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const tenant_id = req.user.tenant_id;
        const quantity = req.body.quantity;
        const item_id = req.params.id;
        const result = await inventoryService.adjustStock(tenant_id, item_id, quantity, "decrement", { transaction: t });

        await inventoryService.recordInventoryMovement(tenant_id, result.item, result.stockChange, result.operation, { transaction: t });
        await t.commit();
        return res.status(200).json({
            success: true,
            message: "update Success",
            data: result
        });
    } catch (error) {
        await t.rollback();
        next(error)
    }
}