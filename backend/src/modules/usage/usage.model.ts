import { Schema, model, Document } from 'mongoose';

export interface IUsageHistory extends Document {
  timestamp: Date;
  totalWatts: number;
  perRoomWatts: {
    DrawingRoom: number;
    WorkRoom1: number;
    WorkRoom2: number;
  };
}

const usageHistorySchema = new Schema<IUsageHistory>(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    totalWatts: { type: Number, required: true },
    perRoomWatts: {
      DrawingRoom: { type: Number, required: true, default: 0 },
      WorkRoom1: { type: Number, required: true, default: 0 },
      WorkRoom2: { type: Number, required: true, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const UsageHistory = model<IUsageHistory>('UsageHistory', usageHistorySchema);
