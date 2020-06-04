// @flow
import { gql } from 'apollo-server';

export type ProductType = {
  _id: string,
  name: string,
  description: string,
  price: number,
  quantityInStock: number,
  active: boolean,
};

export type ProductConnection = {
  count: number,
  products: Array<ProductType>,
};

const productType: string = gql`
  type Product {
    _id: String
    name: String
    description: String
    price: Float
    quantityInStock: Int
    active: Boolean
  }

  type ProductConnection {
    count: Int
    products: [User]
  }
`;

export default productType;
