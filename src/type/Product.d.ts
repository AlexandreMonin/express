import Orders_Products from "../class/orders_products";

type Product = {
    id: number;
    name: String;
    description?: String;
    price: number;
    orders_products?: Orders_Products[];
};

export default Product;