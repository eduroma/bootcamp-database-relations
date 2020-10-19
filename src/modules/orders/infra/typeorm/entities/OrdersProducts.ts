import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  order_id: string;

  @ManyToOne(() => Order)
  @JoinColumn({
    name: 'order_id'
  })
  order: Order;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'product_id'
  })
  product: Product;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
