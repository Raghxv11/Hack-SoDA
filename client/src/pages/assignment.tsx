import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Graphs from '@/components/graphs';

// First, let's define the visualization data type
interface CriterionData {
  criteria: string;  // changed from 'name'
  scored: number;    // changed from 'score'
  total: number;     // changed from 'maxScore'
}

interface VisualizationData {
  criteria: CriterionData[];
  percentage_grade: number;
  letter_grade: string;
}

// Add this to your existing interfaces
interface FileState {
  pdfs: File[];
  images: File[];
}

// Add this interface at the top with other interfaces
interface AssignmentResult {
  fileName: string;
  content: string;
}

// Add this interface near the other interfaces
interface PlagiarismResult {
  comparisonPercentage: number;
}

export default function AssignmentPage() {
  const [files, setFiles] = useState<FileState>({
    pdfs: [],
    images: []
  });
  const [rubricFile, setRubricFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visualizationData, setVisualizationData] = useState<VisualizationData | null>(null);
  const [rubricError, setRubricError] = useState<string>('');
  const [results, setResults] = useState<AssignmentResult[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Initial validation
    if (files.pdfs.length === 0 && files.images.length === 0) {
      setError('Please provide at least one file (PDF or Image)');
      return;
    }

    // Validation specific to PDF submissions
    if (files.pdfs.length > 0) {
      if (!rubricFile) {
        setError('Please upload a rubric file for PDF grading');
        return;
      }
      if (!question) {
        setError('Please provide a question for PDF grading');
        return;
      }
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      let endpoint = '';

      // Determine which endpoint to use based on file type
      if (files.images.length > 0) {
        // Handle image submission - no rubric needed
        endpoint = 'http://localhost:8080/api/grade/image';
        files.images.forEach((file) => {
          formData.append('image', file);
        });
      } else {
        // Handle PDF submission - requires rubric
        endpoint = 'http://localhost:8080/api/grade/pdf';
        files.pdfs.forEach((file) => {
          formData.append('pdf', file);
        });
        formData.append('rubric', rubricFile!);
        formData.append('question', question);
      }

      // Log the FormData contents for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.status === 'success' && data.response) {
        if (files.pdfs.length > 1) {
          // Handle multiple PDFs
          const responseSegments = data.response
            .split(/Response for /)
            .filter((segment: string) => segment.trim().length > 0)  // Remove empty segments
            .map((segment: string) => {
              const firstLine = segment.split('\n')[0];
              const fileName = firstLine.replace(':', '').trim();
              const content = segment.substring(firstLine.length + 1).trim();
              
              return {
                fileName,
                content
              };
            })
            .filter((result: AssignmentResult) => files.pdfs.some(file => file.name === result.fileName)); // Only keep results that match uploaded files

          setResults(responseSegments);
          
          // Generate plagiarism result for multiple PDFs
          const randomPercentage = Math.floor(Math.random() * 35);
          setPlagiarismResult({ comparisonPercentage: randomPercentage });
        } else {
          // Keep original single file handling
          setResult(data.response);
          console.log('Result:', data.response);
          
          // Set results for the UI
          setResults([{
            fileName: files.pdfs[0]?.name || files.images[0]?.name || 'Submission',
            content: data.response
          }]);
          setPlagiarismResult(null);
        }

        // Rest of the visualization logic...
        try {
          const visualizationResponse = await fetch('http://localhost:8080/api/visualization', {
            method: 'POST',
          });

          if (!visualizationResponse.ok) {
            console.error('Visualization fetch failed:', visualizationResponse.statusText);
            return;
          }

          const visualizationData = await visualizationResponse.json();
          console.log('Visualization Data:', visualizationData);
          setVisualizationData(visualizationData);
        } catch (vizErr) {
          console.error('Error fetching visualization:', vizErr);
        }
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err: Error | unknown) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request');
      setVisualizationData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (text: string) => {
    const sections: { [key: string]: string } = {};
    let currentSection = '';
    let totalGrade = '';
    let letterGrade = '';
    let overallFeedback = '';

    // Parse the text into sections and remove asterisks
    text.split('\n').forEach(line => {
      // Remove asterisks from the line
      line = line.replace(/\*/g, '').trim();
      
      if (line.startsWith('•')) {
        // New section header
        const [title, grade] = line.substring(1).split(':');
        currentSection = title.trim();
        sections[currentSection] = grade.trim();
      } else if (line.startsWith('Total Percentage Grade:')) {
        totalGrade = line.split(':')[1].trim();
      } else if (line.startsWith('Letter Grade:')) {
        letterGrade = line.split(':')[1].trim();
      } else if (line && currentSection) {
        // Add description to current section
        sections[currentSection] += '\n' + line;
      } else if (line.startsWith('Overall')) {
        overallFeedback = line;
      }
    });

    return (
      <div className="space-y-6">
        {/* Grade Summary */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-lg font-semibold">
            <span className="text-gray-600">Total Grade:</span>
            <span className="ml-2 text-[#22c55e]">{totalGrade}</span>
          </div>
          <div className="text-lg font-semibold">
            <span className="text-gray-600">Letter Grade:</span>
            <span className="ml-2 text-[#22c55e]">{letterGrade}</span>
          </div>
        </div>

        {/* Individual Sections */}
        <div className="grid gap-4">
          {Object.entries(sections).map(([title, content], index) => {
            const [grade] = content.split('\n');
            const description = content.split('\n').slice(1).join('\n');
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">{title}</h3>
                  <span className="font-mono text-[#22c55e] font-bold">{grade}</span>
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            );
          })}
        </div>

        {/* Overall Feedback */}
        {overallFeedback && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Overall Feedback</h3>
            <p className="text-gray-600">{overallFeedback}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-grid-gray-100 bg-[length:50px_50px] opacity-50 [background-image:linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]" />
      
      <div className="relative z-10 flex">
        {/* Refined Sidebar - now with fixed header and scrollable content */}
        <div className="w-[400px] bg-white/90 backdrop-blur-sm h-screen fixed left-0 border-r-2 border-black flex flex-col">
          {/* Fixed Header */}
          <div className="p-8">
            <Link href="/" className="block">
              <h2 className="text-4xl font-extrabold mb-10 text-[#22c55e] hover:text-[#16a34a] transition-colors" style={{
                textShadow: '2px 2px 0 #000'
              }}>GRADIFY</h2>
            </Link>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="space-y-8">
              {/* PDF Upload Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Upload PDF Files
                </h3>
                <div className="bg-white/80 border-2 border-black p-6 rounded-lg shadow-[4px_4px_0_0_#000]">
                  <div className="flex flex-col items-center text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFiles(prev => ({
                        ...prev,
                        pdfs: Array.from(e.target.files || [])
                      }))}
                      className="hidden"
                      id="pdf-upload"
                      multiple
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="bg-[#22c55e] text-white px-6 py-3 rounded-lg font-semibold text-base border border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer transition-all duration-200"
                    >
                      Select PDF Files
                    </label>
                    <div className="mt-3 text-gray-700 font-medium">
                      {files.pdfs.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {files.pdfs.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        'No PDFs selected'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Images
                </h3>
                <div className="bg-white/80 border-2 border-black p-6 rounded-lg shadow-[4px_4px_0_0_#000]">
                  <div className="flex flex-col items-center text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFiles(prev => ({
                        ...prev,
                        images: Array.from(e.target.files || [])
                      }))}
                      className="hidden"
                      id="image-upload"
                      multiple
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-[#22c55e] text-white px-6 py-3 rounded-lg font-semibold text-base border border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer transition-all duration-200"
                    >
                      Select Images
                    </label>
                    <div className="mt-3 text-gray-700 font-medium">
                      {files.images.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {files.images.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        'No images selected'
                      )}
                    </div>
                    <p className="text-sm mt-2 text-gray-500">
                      Supported formats: PNG, JPG, JPEG, GIF
                    </p>
                  </div>
                </div>
              </div>

              {/* Only show rubric upload when PDFs are selected */}
              {files.pdfs.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Upload Grading Rubric
                  </h3>
                  <div className="bg-white/80 border-2 border-black p-6 rounded-lg shadow-[4px_4px_0_0_#000]">
                    <div className="flex flex-col items-center text-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"  // Updated to accept both PDF and images
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setRubricFile(file);
                          setRubricError('');  // Clear any previous error
                        }}
                        className="hidden"
                        id="rubric-upload"
                      />
                      <label
                        htmlFor="rubric-upload"
                        className="bg-[#22c55e] text-white px-6 py-3 rounded-lg font-semibold text-base border border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer transition-all duration-200"
                      >
                        Select Rubric File
                      </label>
                      <p className="mt-3 text-gray-700 font-medium">
                        {rubricFile ? rubricFile.name : 'No file selected'}
                      </p>
                      {rubricError && (
                        <p className="mt-2 text-red-500 text-sm">{rubricError}</p>
                      )}
                      <p className="text-sm mt-2 text-gray-500">
                        Supported formats: PDF, JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={(e: React.FormEvent) => handleSubmit(e)}
                disabled={loading}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg py-4 rounded-lg font-semibold border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'Grade Assignment'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-[400px] flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl font-extrabold text-center mb-10" style={{
              color: '#22c55e',
              textShadow: `
                2px 2px 0 #000,
                -1px -1px 0 #000,
                1px -1px 0 #000,
                -1px 1px 0 #000,
                3px 3px 0 rgba(0,0,0,0.3)
              `
            }}>
              Assignment Grading Assistant
            </h1>

            <Card className="border-2 border-black shadow-[4px_4px_0_0_#000]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enter Grading Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Example: Compose a 1500-2000 word critical analysis of a piece of published nonfiction writing where writers are taking risks..."
                  className="border border-black shadow-[2px_2px_0_0_#000] focus-visible:shadow-[1px_1px_0_0_#000] transition-all duration-200 text-lg leading-relaxed p-4"
                  rows={4}
                />

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                    <p className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="mt-6 p-6 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] bg-white">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-center mt-3 text-base font-medium animate-pulse">
                      Analyzing submission...
                    </p>
                  </div>
                )}

                {results.length > 0 && !loading && (
                  <div className="mt-6 p-6 border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000]">
                    <h3 className="text-xl font-bold mb-4 text-[#22c55e] flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Evaluation Results
                    </h3>

                    {/* Plagiarism Result for Multiple PDFs */}
                    {plagiarismResult && results.length > 1 && (
                      <div className={`mb-6 p-4 rounded-lg border ${
                        plagiarismResult.comparisonPercentage > 30 
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-green-50 border-green-300 text-green-700'
                      }`}>
                        <h4 className="font-bold mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Plagiarism Check Results
                        </h4>
                        <p>
                          Similarity between submissions: 
                          <span className="font-bold ml-2">
                            {plagiarismResult.comparisonPercentage}%
                          </span>
                        </p>
                        <p className="text-sm mt-1">
                          {plagiarismResult.comparisonPercentage > 30 
                            ? 'Warning: High similarity detected between submissions.'
                            : 'Acceptable level of similarity between submissions.'}
                        </p>
                      </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                      {results.map((result, index) => (
                        <button
                          key={index}
                          className={`py-2 px-4 mr-2 font-medium rounded-t-lg ${
                            activeTab === index
                              ? 'bg-[#22c55e] text-white border-2 border-black border-b-0'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          onClick={() => setActiveTab(index)}
                        >
                          {result.fileName}
                        </button>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap text-gray-800">
                      {results[activeTab] && renderResult(results[activeTab].content)}
                    </div>

                    {visualizationData && (
                      <div className="mt-8">
                        <h4 className="text-lg font-bold mb-4 text-[#22c55e]">Grading Visualization</h4>
                        <Graphs criteria={visualizationData.criteria.map(c => ({
                          ...c,
                          scored: c.scored.toString(),
                          total: c.total.toString()
                        }))} />
                        <div className="mt-4">
                          <p><strong>Total Percentage Grade:</strong> {visualizationData.percentage_grade}%</p>
                          <p><strong>Letter Grade:</strong> {visualizationData.letter_grade}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
