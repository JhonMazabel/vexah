import Customer from './Customer.js';
import User from './User.js';
import Order from './Order.js';
import OrderDetail from './OrderDetail.js';
import Product from './Product.js';
import InventoryTransaction from './InventoryTransaction.js';

// Definir Relaciones

// Relación Customer - Order
Customer.hasMany(Order, { foreignKey: 'id_cliente' });
Order.belongsTo(Customer, { foreignKey: 'id_cliente' });

// Relación User - Order (Sales Advisor)
User.hasMany(Order, { foreignKey: 'id_asesor' });
Order.belongsTo(User, { foreignKey: 'id_asesor' });

// Relación Order - OrderDetail
Order.hasMany(OrderDetail, { foreignKey: 'id_orden' });
OrderDetail.belongsTo(Order, { foreignKey: 'id_orden' });

// Relación Product - OrderDetail
Product.hasMany(OrderDetail, { foreignKey: 'id_producto' });
OrderDetail.belongsTo(Product, { foreignKey: 'id_producto' });

// Relación Product - InventoryTransaction
Product.hasMany(InventoryTransaction, { foreignKey: 'id_producto' });
InventoryTransaction.belongsTo(Product, { foreignKey: 'id_producto' });

// Relación User - InventoryTransaction
User.hasMany(InventoryTransaction, { foreignKey: 'id_usuario' });
InventoryTransaction.belongsTo(User, { foreignKey: 'id_usuario' });

export {
    Customer,
    User,
    Order,
    OrderDetail,
    Product,
    InventoryTransaction
};