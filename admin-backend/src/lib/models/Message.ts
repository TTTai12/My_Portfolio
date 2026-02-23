// src/lib/models/Message.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date(), index: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: false }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
