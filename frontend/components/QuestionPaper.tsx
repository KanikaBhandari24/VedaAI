import { GeneratedPaper } from '@/types';

const difficultyColor = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

export default function QuestionPaper({ paper }: { paper: GeneratedPaper }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 border-b border-gray-200 pb-6">
        <h1 className="text-xl font-bold text-gray-900">{paper.schoolName}</h1>
        <p className="text-gray-600 mt-1">Subject: {paper.subject}</p>
        <p className="text-gray-600">Class: {paper.className}</p>
      </div>

      {/* Meta */}
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>Time Allowed: {paper.timeAllowed}</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      <p className="text-sm text-gray-700 mb-6 font-medium">
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Student Info */}
      <div className="flex gap-8 mb-8 text-sm">
        <div>Name: <span className="border-b border-gray-400 inline-block w-40 ml-1" /></div>
        <div>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-1" /></div>
        <div>Class/Section: <span className="border-b border-gray-400 inline-block w-24 ml-1" /></div>
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <div key={si} className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-1">{section.title}</h2>
          <p className="text-sm text-gray-500 italic mb-4">{section.instruction}</p>

          <div className="space-y-4">
            {section.questions.map((q, qi) => {
              const globalIndex = paper.sections
                .slice(0, si)
                .reduce((sum, s) => sum + s.questions.length, 0) + qi + 1;

              return (
                <div key={qi} className="flex items-start gap-3">
                  <span className="text-sm text-gray-700 font-medium min-w-[24px]">
                    {globalIndex}.
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">[{q.marks} Marks]</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Answer Key */}
      {paper.answerKey.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Answer Key</h2>
          <div className="space-y-2">
            {paper.answerKey.map((answer, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-medium text-gray-700 min-w-[24px]">{i + 1}.</span>
                <p className="text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}