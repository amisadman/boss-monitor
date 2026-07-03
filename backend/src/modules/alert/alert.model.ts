import { Schema, model, Document } from 'mongoose';

export interface IAlert extends Document {
  type: 'after-hours' | 'prolonged-on';
  scope: string;
  message: string;
  triggeredAt: Date;
  resolvedAt: Date | null;
  notifiedDiscord: boolean;
}

const alertSchema = new Schema<IAlert>(
  {
    type: { type: String, required: true, enum: ['after-hours', 'prolonged-on'] },
    scope: { type: String, required: true },
    message: { type: String, required: true },
    triggeredAt: { type: Date, required: true, default: Date.now },
    resolvedAt: { type: Date, default: null },
    notifiedDiscord: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

export const Alert = model<IAlert>('Alert', alertSchema);
