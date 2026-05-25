import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import Assignment from '../models/Assignment';
import { generateQuestionPaper } from '../services/groqService';
import { notifyClient } from '../ws/wsManager';

export const startWorker = () => {
  const worker = new Worker(
    'assignment-generation',
    async (job) => {
      const { assignmentId } = job.data;

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error('Assignment not found');

      assignment.status = 'processing';
      await assignment.save();

      notifyClient(assignmentId, { status: 'processing' });

      try {
        const result = await generateQuestionPaper(
          assignment.questionTypes,
          assignment.additionalInstructions || '',
          assignment.fileContent
        );

        assignment.status = 'completed';
        assignment.result = result;
        await assignment.save();

        notifyClient(assignmentId, { status: 'completed', result });
      } catch (err) {
        assignment.status = 'failed';
        await assignment.save();
        notifyClient(assignmentId, { status: 'failed' });
        throw err;
      }
    },
    { connection: redis }
  );

  worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));
};