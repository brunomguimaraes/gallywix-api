import ProductModel from './ProductModel';
// import UserModel from '../user/UserModel';
import type { ProductType, ProductConnection } from './ProductTypes';
import type { Context } from '../TypeDefinitions';

type FindOneProduct = {
  id: string,
};

type ConnectionArgs = {
  search: string,
  after: string,
  first: number,
};

type ProductArgs = {
  name: string,
  description: string,
  price: number,
  quantityInStock: number,
};

const resolvers: Object = {
  // TODO: products relations goes here:
  // DELETE ME LATER
  // Product: {
  //   user: async ({ user }: ProductType) => await UserModel.findOne({ _id: user }),
  // },
  product: async (obj: ProductType, args: FindOneProduct): Promise<?PostType> => {
    const { id } = args;

    const product = await ProductModel.findOne({ _id: id });
    return product;
  },
  createProduct: async (obj: ProductType, args: ProductArgs, context: Context): Promise<?ProductType> => {
    const { name, description, price, quantityInStock } = args;
    const { user } = context;

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (!user.isAdmin) {
      throw new Error('User is not Admin');
    }

    const product = new ProductModel({
      name,
      description,
      price,
      quantityInStock,
    });

    await product.save();

    const { _id } = product;

    return await ProductModel.findOne({ _id });
  },
  products: async (obj: ProductType, args: ConnectionArgs): ProductConnection => {
    const { search, after, first } = args;

    const where = search
      ? {
        name: {
          $regex: new RegExp(`^${search}^`, 'ig'),
        },
      }
      : {};

    const products = !after
      ? ProductModel.find(where).limit(first)
      : ProductModel.find(where)
        .skip(after)
        .limit(first);

    return {
      count: ProductModel.count(),
      products,
    };
  },
};

export default resolvers;
