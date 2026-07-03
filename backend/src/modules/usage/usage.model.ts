import { Schema, model, Document } from 'mongoose';

export interface IUsageHistory extends Document {
  timestamp: Date;
  totalWatts: number;
  perRoomWatts: {
    drawing: number;
    work1: number;
    work2: number;
  };
}

const usageHistorySchema = new Schema<IUsageHistory>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    totalWatts: { type: Number, required: true },
    perRoomWatts: {
      drawing: { type: Number, required: true, default: 0 },
      work1: { type: Number, required: true, default: 0 },
      work2: { type: Number, required: true, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const UsageHistory = model<IUsageHistory>('UsageHistory', usageHistorySchema);
