import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  _id: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
});

const CartSchema: Schema<ICart> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Calculate total amount before saving
CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
 ;
});

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
export default Cart;