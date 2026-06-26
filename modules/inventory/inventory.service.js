const MOVEMENT_TYPES = require('../../core/utils/movementTypes');
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

exports.createInventoryItem = async (tenant_id, item_info, options = {}) => {
    try {
        const create = await inventoryItems.create({
            tenant_id: tenant_id,
            item_name: item_info.name,
            sku: item_info.sku || null,
            quantity: item_info.quantity,
            cost_price: item_info.cost_price,
            selling_price: item_info.selling_price,
            minimum_stock: item_info.minimum_stock,
            image_url: item_info.image_url
        }, options)
        return create;
    } catch (error) {
        throw new Error("Error creating inventory item");
    }
}

exports.createItemMovementInfo = async (item_record, options = {}) => {
    try {
        const create_movement = await inventoryMovemnet.create({
            tenant_id: item_record.tenant_id,
            item_id: item_record.id,
            movement_type: "PURCHASE",
            quantity: item_record.quantity,
            remarks: "Purchase recorded"
        }, options)
    } catch (error) {
        throw new Error("Error creating inventory movement");
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
            item_name: update_info.name ?? item.name,
            sku: update_info.sku ?? item.sku,
            quantity: update_info.quantity ?? item.quantity,
            cost_price: update_info.cost_price ?? item.cost_price,
            selling_price: update_info.selling_price ?? item.selling_price,
            minimum_stock: update_info.minimum_stock ?? item.minimum_stock,
            image_url: update_info.image_url ?? item.image_url
        }, options)

        return { old_item, update_details };
    } catch (error) {
        throw new Error("Error Updating Inventory item")
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
        console.log("ERROR:", error);

        throw new Error("Error creating update movement log");
    }
}

exports.InventortyMovement = async(user_info)=>{
    return await inventoryMovemnet.findAll({where:{tenant_id:user_info.tenant_id},order:[['createdAt','DESC']]})
}

exports.InventortyMovementById = async(user_info,item_id)=>{
    return await inventoryMovemnet.findOne({where:{
        id:item_id,
        tenant_id:user_info.tenant_id,
    }})
}
