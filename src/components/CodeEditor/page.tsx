// components/CodeEditor.tsx
"use client";
import React, { useState } from 'react';
import { PseudocodeInterpreter } from '../../utils/pseudocodeInterpreter';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [inputQueue, setInputQueue] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const handleRunCode = () => {
    const inputs = inputQueue.split(',').map((input) => {
      const trimmedInput = input.trim();
      // Check if the input is a number; if not, keep it as a string
      return !isNaN(Number(trimmedInput)) ? parseFloat(trimmedInput) : trimmedInput;
    });

    const interpreter = new PseudocodeInterpreter(inputs);
    const result = interpreter.execute(code);
    setOutput(result);
  };


  const handleExportCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'pseudocode.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImportCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCode(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const highlightCode = (code: string) => {
    return Prism.highlight(code, Prism.languages.python, 'python');
  };

  return (
    <div style={containerStyle}>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={highlightCode}
        padding={10}
        style={editorStyle}
      />
      <textarea
        placeholder="Enter inputs separated by commas (e.g., 3, 8, 20)"
        value={inputQueue}
        onChange={(e) => setInputQueue(e.target.value)}
        style={inputAreaStyle}
      />
      <div style={buttonGroupStyle}>
        <button onClick={handleRunCode} style={buttonStyle}>Run Code</button>
        <button onClick={handleExportCode} style={buttonStyle}>Export Code</button>
        <input
          type="file"
          accept=".txt"
          onChange={handleImportCode}
          style={fileInputStyle}
        />
      </div>
      <pre style={outputStyle}>{output}</pre>
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  backgroundColor: '#282c34',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'stretch',
  gap: '16px',
};

const editorStyle = {
  fontFamily: '"Fira Code", "Fira Mono", monospace',
  fontSize: '14px',
  backgroundColor: '#011627',
  color: '#d6deeb',
  borderRadius: '5px',
  height: '300px',
  overflow: 'auto',
};

const inputAreaStyle = {
  width: '100%',
  height: '50px',
  padding: '8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '14px',
  backgroundColor: '#1e1e1e',
  color: '#dcdcdc',
  border: '1px solid #333',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  backgroundColor: '#61dafb',
  color: '#282c34',
  cursor: 'pointer',
  border: 'none',
};

const fileInputStyle = {
  cursor: 'pointer',
  backgroundColor: '#333',
  color: '#dcdcdc',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #555',
};

const outputStyle = {
  backgroundColor: '#1e1e1e',
  padding: '10px',
  borderRadius: '4px',
  color: '#dcdcdc',
  whiteSpace: 'pre-wrap' as const,
  fontFamily: 'monospace',
};

export default CodeEditor;
