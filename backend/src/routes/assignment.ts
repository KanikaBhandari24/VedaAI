import { Router, Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { assignmentQueue } from '../queues/assignmentQueue';
import { redis } from '../config/redis';

const router = Router();

// Create assignment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, dueDate, questionTypes, additionalInstructions, fileContent } = req.body;

    if (!title || !dueDate || !questionTypes?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    for (const qt of questionTypes) {
      if (!qt.type || qt.count <= 0 || qt.marks <= 0) {
        return res.status(400).json({ error: 'Invalid question type data' });
      }
    }

    const assignment = await Assignment.create({
      title,
      dueDate,
      questionTypes,
      additionalInstructions,
      fileContent,
    });

    await assignmentQueue.add('generate', { assignmentId: assignment._id.toString() });

    return res.status(201).json({ assignmentId: assignment._id, status: 'pending' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all assignments
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'assignments:all';
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const assignments = await Assignment.find().sort({ createdAt: -1 }).select('-result');
    await redis.setex(cacheKey, 60, JSON.stringify(assignments));
    return res.json(assignments);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get single assignment with result
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cacheKey = `assignment:${req.params.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });

    if (assignment.status === 'completed') {
      await redis.setex(cacheKey, 300, JSON.stringify(assignment));
    }
    return res.json(assignment);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete assignment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await redis.del(`assignment:${req.params.id}`);
    await redis.del('assignments:all');
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;