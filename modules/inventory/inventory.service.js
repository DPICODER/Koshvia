const AppError = require('../../core/utils/errors/AppError');
const MOVEMENT_TYPES = require('../../core/utils/movementTypes');
const STOCK_OPERATION = require('../../core/utils/stockOperations');
const inventoryItems = require('./inventory.item.model');
const inventoryMovemnet = require('./inventory.movement.model');
/**
 * gets all inventory items of logged in user/comany
 * @param {UUID} user_id 
 * @returns {Promise.object}
 */
exports.getUserInventory = async (user_id) => {
    return await inventoryItems.findAll({ where: { tenant_id: user_id } });
}

/**
 * 
 * @param {UUID} tenant_id 
 * @param {Object} item_info 
 * @param {Object} options 
 * @returns {Promise.Object}
 */
exports.createInventoryItem = async (tenant_id, item_info, options = {}) => {
    try {
        
        const item = await inventoryItems.create({
            tenant_id: tenant_id,
            item_name: item_info.item_name,
            sku: item_info.sku || null,
            quantity: item_info.quantity,
            cost_price: item_info.cost_price,
            selling_price: item_info.selling_price,
            minimum_stock: item_info.minimum_stock,
            image_url: item_info.image_url
        }, options)

        const stockChange = {
            quantity:item_info.quantity,
            old_quantity:0,
            new_quantity:item_info.quantity,
            quantity_changed:item_info.quantity
        }

        return {
            item,
            stockChange,
            operation:MOVEMENT_TYPES.PURCHASE
        };
    } catch (error) {
        console.error(error);
        throw error
    }
}



exports.getInventoryItemById = async (item_id, tenant_id) => {
    return await inventoryItems.findOne({
        where: {
            id: item_id,
            tenant_id: tenant_id
        }
    });
}

exports.updateInventoryItem = async (tenant_id, item_id, update_info, options = {}) => {
    try {
        const item = await exports.getInventoryItemById(item_id, tenant_id);
        if (!item) {
            throw new Error("Inventory item not found");
        }
        const old_item = item.toJSON();
        const update_details = await item.update({
            item_name: update_info.item_name ?? item.item_name,
            sku: update_info.sku ?? item.sku,
            quantity: update_info.quantity ?? item.quantity,
            cost_price: update_info.cost_price ?? item.cost_price,
            selling_price: update_info.selling_price ?? item.selling_price,
            minimum_stock: update_info.minimum_stock ?? item.minimum_stock,
            image_url: update_info.image_url ?? item.image_url
        }, options)

        return { old_item, update_details };
    } catch (error) {
        console.error(error);
        throw error
    }
}

exports.updateInventoryMovement = async (old_entry, new_entry, update_info, options = {}) => {
    try {
        await inventoryMovemnet.create({
            tenant_id: new_entry.tenant_id,
            item_id: new_entry.id,
            movement_type: MOVEMENT_TYPES.ADJUSTMENT,
            quantity: Math.abs(new_entry.quantity - old_entry.quantity),
            remarks: `Admin updated: ${Object.keys(update_info).join(', ')}`,
            old_quantity: old_entry.quantity,
            updated_quantity: new_entry.quantity,
            difference_quantity: new_entry.quantity - old_entry.quantity,
        }, options)
    } catch (error) {
        console.error(error);
        throw error
    }
}

exports.getInventoryHistory = async (tenant_id, limit, offset) => {

    return await inventoryMovemnet.findAll({
        where: {
            tenant_id: tenant_id
        }, limit, offset,
        order: [['createdAt', 'DESC']]
    })
}

exports.getInventoryHistoryById = async (tenant_id, item_id) => {
    return await inventoryMovemnet.findAll({
        where: {
            item_id: item_id,
            tenant_id: tenant_id,
        }, order: [['createdAt', 'DESC']]
    })
}

exports.adjustStock = async (tenant_id, item_id, quantity, operation, options = {}) => {
    try {
        const item = await exports.getInventoryItemById(item_id, tenant_id);
        
        if (!item) {
            throw new AppError("Inventory item not found",404)
        }

        const old_quantity = item.quantity;
        if(operation === STOCK_OPERATION.DECREMENT && item.quantity < quantity){
             throw new AppError("Insufficent Stock",400);
        }
        await item[operation]("quantity", {
            by: quantity,
            ...options
        })
        await item.reload({ transaction: options.transaction });

        const stockChange = {
            old_quantity:old_quantity,
            new_quantity:item.quantity,
            quantity_changed:quantity
        }

        return {
            item,
            stockChange,
            operation:operation === STOCK_OPERATION.INCREMENT ? MOVEMENT_TYPES.PURCHASE : MOVEMENT_TYPES.SALE
        };
    }
    catch (error) {
        console.error(error);
        throw error
    }
}

exports.recordInventoryMovement = async (tenant_id,item_info,stockChange,operation,options={})=>{
   return await inventoryMovemnet.create({
        tenant_id:tenant_id,
        item_id:item_info.id,
        movement_type:operation,
        quantity:stockChange.quantity_changed,
        old_quantity:stockChange.old_quantity,
        updated_quantity:stockChange.new_quantity,
        difference_quantity:stockChange.new_quantity - stockChange.old_quantity,
        remarks:operation === MOVEMENT_TYPES.PURCHASE ? "Purchase recorded" : "Sale recorded"
   },options);
}