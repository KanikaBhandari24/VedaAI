'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';
import { QuestionType } from '@/types';
import { Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks',
];

export default function CreateAssignmentForm() {
  const router = useRouter();
  const { submitAssignment, isLoading } = useAssignmentStore();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { type: 'Multiple Choice Questions', count: 4, marks: 1 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: 'Short Questions', count: 3, marks: 2 }]);
  };

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const updateQuestionType = (index: number, field: keyof QuestionType, value: string | number) => {
    const updated = [...questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionTypes(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFileContent(ev.target?.result as string);
    reader.readAsText(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (questionTypes.length === 0) newErrors.questionTypes = 'Add at least one question type';
    questionTypes.forEach((qt, i) => {
      if (qt.count <= 0) newErrors[`count_${i}`] = 'Must be > 0';
      if (qt.marks <= 0) newErrors[`marks_${i}`] = 'Must be > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalQuestions = questionTypes.reduce((s, qt) => s + Number(qt.count), 0);
  const totalMarks = questionTypes.reduce((s, qt) => s + Number(qt.count) * Number(qt.marks), 0);

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const id = await submitAssignment({
        title,
        dueDate,
        questionTypes,
        additionalInstructions,
        fileContent,
      });
      router.push(`/assignments/${id}`);
    } catch {
      setErrors({ submit: 'Failed to create assignment. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
        <h1 className="text-lg font-bold text-gray-900">Create Assignment</h1>
      </div>
      <p className="text-xs text-gray-500 mb-5 ml-4">Set up a new assignment for your students.</p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
        <div className="h-1 bg-gray-900 rounded-full w-1/2" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">

        {/* Assignment Details heading */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Assignment Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Basic information about your assignment</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Assignment Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quiz on Electricity"
            className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* File Upload */}
        <div>
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition bg-gray-50">
            <div className="text-2xl mb-2">☁️</div>
            <p className="text-xs text-gray-500 mb-1">Choose a file or drag & drop it here</p>
            <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF up to 10MB</p>
            <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition inline-block">
              Browse Files
              <input type="file" accept=".txt,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
            {fileName && <p className="text-xs text-green-600 mt-2">✓ {fileName}</p>}
          </div>
          <p className="text-xs text-gray-400 mt-1">Upload images of your preferred document/image</p>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>

        {/* Question Types */}
        <div>
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium mb-2">
            <div className="col-span-6">Question Type</div>
            <div className="col-span-2 text-center">No. of Questions</div>
            <div className="col-span-2 text-center">Marks</div>
            <div className="col-span-2"></div>
          </div>

          <div className="space-y-2">
            {questionTypes.map((qt, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6 flex items-center gap-1">
                  <select
                    value={qt.type}
                    onChange={(e) => updateQuestionType(index, 'type', e.target.value)}
                    className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeQuestionType(index)}
                    className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuestionType(index, 'count', Math.max(1, qt.count - 1))}
                      className="px-2 py-2 text-gray-500 hover:bg-gray-100 text-xs"
                    >−</button>
                    <input
                      type="number"
                      min="1"
                      value={qt.count}
                      onChange={(e) => updateQuestionType(index, 'count', Number(e.target.value))}
                      className="w-full text-center text-gray-900 bg-white text-xs py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => updateQuestionType(index, 'count', qt.count + 1)}
                      className="px-2 py-2 text-gray-500 hover:bg-gray-100 text-xs"
                    >+</button>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuestionType(index, 'marks', Math.max(1, qt.marks - 1))}
                      className="px-2 py-2 text-gray-500 hover:bg-gray-100 text-xs"
                    >−</button>
                    <input
                      type="number"
                      min="1"
                      value={qt.marks}
                      onChange={(e) => updateQuestionType(index, 'marks', Number(e.target.value))}
                      className="w-full text-center text-gray-900 bg-white text-xs py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => updateQuestionType(index, 'marks', qt.marks + 1)}
                      className="px-2 py-2 text-gray-500 hover:bg-gray-100 text-xs"
                    >+</button>
                  </div>
                </div>
                <div className="col-span-2"></div>
              </div>
            ))}
          </div>

          <button
            onClick={addQuestionType}
            className="mt-3 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition"
          >
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
              <Plus size={10} className="text-white" />
            </div>
            Add Question Type
          </button>

          <div className="mt-3 text-xs text-gray-600 text-right">
            <span>Total Questions : {totalQuestions}</span>
            <span className="ml-4">Total Marks : {totalMarks}</span>
          </div>
        </div>

        {/* Additional Instructions */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="e.g. Generate a question paper for 2 hour exam duration..."
              rows={3}
              className="w-full text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition bg-white"
        >
          <ArrowLeft size={14} /> Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Next'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}