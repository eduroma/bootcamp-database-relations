import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found!')
    }

    const checkedProducts = await this.productsRepository.findAllById(products)

    if (products.length !== checkedProducts.length) {
      throw new AppError('One or more products doesn`t not exist!')
    }


    const updatedProducts: IUpdateProductsQuantityDTO[] = [];
    const orderProducts = products.map(product => {

      const checkedProduct = checkedProducts.find(p => p.id === product.id)

      const newProductQuantity = (checkedProduct?.quantity || 0) - product.quantity;

      if (newProductQuantity < 0) {
        throw new AppError('One or more products are not available for this order!');
      }

      updatedProducts.push({
        id: product.id,
        quantity: newProductQuantity
      })

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: checkedProduct?.price || 0
      }
    })

    await this.productsRepository.updateQuantity(updatedProducts);

    const order = await this.ordersRepository.create({ customer, products: orderProducts });

    return order;
  }
}

export default CreateOrderService;
