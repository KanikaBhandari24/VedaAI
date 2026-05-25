import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
  fileContent?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: object;
  createdAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  questionTypes: [
    {
      type: { type: String, required: true },
      count: { type: Number, required: true },
      marks: { type: Number, required: true },
    },
  ],
  additionalInstructions: String,
  fileContent: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  result: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);