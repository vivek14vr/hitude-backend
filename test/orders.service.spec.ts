import { OrdersService } from '../src/orders/orders.service';

describe('OrdersService', () => {
  it('reprices order items from the published product catalog', async () => {
    const create = jest.fn().mockImplementation(async (order) => order);
    const find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: '507f1f77bcf86cd799439011', name: 'Sassy Hi', status: 'in_stock', packs: [{ quantity: 10, price: 349 }] }]),
      }),
    });
    const service = new OrdersService({ findOne: jest.fn().mockResolvedValue(null), create } as never, { find } as never);

    await service.create({
      items: [{ productId: '507f1f77bcf86cd799439011', quantity: 2, pack: 10 }],
      subtotal: 1,
      total: 1,
      shippingAddress: { firstName: 'Test', lastName: 'User', phone: '9999999999', address: '1 Main Street', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    }, 'user-1');

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ subtotal: 698, total: 777, items: [{ productId: '507f1f77bcf86cd799439011', name: 'Sassy Hi', quantity: 2, pack: 10, unitPrice: 349 }] }));
  });
});
