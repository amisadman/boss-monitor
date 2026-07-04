import { Schema, model, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  type: 'fan' | 'light';
  room: 'DrawingRoom' | 'WorkRoom1' | 'WorkRoom2';
  label: string;
  status: 'on' | 'off';
  wattage: number;
  lastChanged: Date;
  onSince: Date | null;
}

const deviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['fan', 'light'] },
    room: { type: String, required: true, enum: ['DrawingRoom', 'WorkRoom1', 'WorkRoom2'] },
    label: { type: String, required: true },
    status: { type: String, required: true, enum: ['on', 'off'], default: 'off' },
    wattage: { type: Number, required: true },
    lastChanged: { type: Date, required: true, default: Date.now },
    onSince: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Device = model<IDevice>('Device', deviceSchema);
