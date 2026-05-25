import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questionType: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  totalMarks: number;
  sections: GeneratedSection[];
  answerKey: string[];
}

export const generateQuestionPaper = async (
  questionTypes: QuestionType[],
  additionalInstructions: string,
  fileContent?: string
): Promise<GeneratedPaper> => {
  const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.count * qt.marks, 0);
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);

  const prompt = `
You are an expert teacher creating a structured question paper.

${fileContent ? `Reference Material:\n${fileContent}\n\n` : ''}

Create a question paper with the following sections:
${questionTypes
  .map(
    (qt, i) =>
      `Section ${String.fromCharCode(65 + i)}: ${qt.type} - ${qt.count} questions, ${qt.marks} marks each`
  )
  .join('\n')}

Total Questions: ${totalQuestions}
Total Marks: ${totalMarks}

Additional Instructions: ${additionalInstructions || 'None'}

Respond ONLY with a valid JSON object in this exact structure (no markdown, no extra text):
{
  "schoolName": "Delhi Public School",
  "subject": "Science",
  "className": "8th",
  "timeAllowed": "45 minutes",
  "totalMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questionType": "Multiple Choice Questions",
      "questions": [
        {
          "text": "Question text here",
          "difficulty": "Easy",
          "marks": 1
        }
      ]
    }
  ],
  "answerKey": ["Answer 1", "Answer 2"]
}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });

  const raw = response.choices[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as GeneratedPaper;
};