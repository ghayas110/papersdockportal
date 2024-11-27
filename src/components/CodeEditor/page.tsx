"use client";
import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { PseudocodeInterpreter } from '../../utils/pseudocodeInterpreter';

import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [inputQueue, setInputQueue] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const handleRunCode = () => {
    const inputs = inputQueue.split(',').map((input) => {
      const trimmedInput = input.trim();
      return !isNaN(Number(trimmedInput)) ? parseFloat(trimmedInput) : trimmedInput;
    });
  
    const interpreter = new PseudocodeInterpreter(inputs);
    const result = interpreter.execute(code);
    setOutput(result);
   
  };
  const handleClearCode = () => {
    setCode('');
    setInputQueue('');
    setOutput('');
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

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Pseudocode Compiler</h1>
      <div style={mainContentStyle}>
        {/* Editor Section */}
        <div style={editorContainerStyle}>
        <div style={buttonGroupStyle}>
            <button onClick={handleRunCode} style={runButtonStyle}>
              Run
              <span style={{ marginLeft: '5px'}}>

              <PlayCircleOutlined />
              </span>
            </button>
            <button onClick={handleClearCode} style={runButtonStyle2}>
              Clear 
              <span style={{ marginLeft: '5px'}}>
              <DeleteOutlined />
              </span>
            </button>
            <button onClick={handleExportCode} style={exportButtonStyle}>
              Export
            </button>
            <input
              type="file"
              accept=".txt"
              onChange={handleImportCode}
              style={fileInputStyle}
            />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold',color: 'black'}}>Code</h2>
          <MonacoEditor
            height="calc(100vh - 580px)"
            width='100%'
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(newCode) => setCode(newCode || '')}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold',color: 'black'}}>Input</h2>
          <textarea
            placeholder="Enter inputs separated by commas (e.g., 3, 8, 20)"
            value={inputQueue}
            onChange={(e) => setInputQueue(e.target.value)}
            style={inputAreaStyle}
          />
        
        </div>

        {/* Output Section */}
        <div style={outputContainerStyle}>
          <h2 style={outputHeaderStyle}>Output</h2>
          <pre style={outputStyle}>{output}</pre>
        </div>
      </div>
    </div>
  );
};

// Styles for the layout
const containerStyle = {


  color: '#ffffff',
  minHeight: '90vh',

  fontFamily: "'Roboto', sans-serif",
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: 'black',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const mainContentStyle = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'space-between',
 
};

const editorContainerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
  // maxWidth: '600px',
  padding: '10px',

};

const inputAreaStyle = {
  width: '100%',
  height: 'calc(100vh - 880)',
  padding: '10px',
  borderRadius: '8px',
  fontFamily: 'monospace',
  fontSize: '16px',
  backgroundColor: '#282c34',
  color: '#dcdcdc',
  border: '1px solid #333',
  outline: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const runButtonStyle = {
   padding: 5,
 
  display: 'flex',
  flexDirection: 'row'  as const ,

  borderRadius: '8px',
  backgroundColor: '#4caf50',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};
const runButtonStyle2 = {
  padding: ' 3px ',
  borderRadius: '8px',
  backgroundColor: 'red',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};
const exportButtonStyle = {
  ...runButtonStyle,
  backgroundColor: '#2196f3',
};

const fileInputStyle = {
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#333',
  color: '#dcdcdc',
  fontSize: '16px',
  border: '1px solid #555',
};

const outputContainerStyle = {
  flex: 1,
 
  backgroundColor: '#282c34',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const outputHeaderStyle = {
  marginBottom: '10px',
  fontSize: '20px',
  color: '#61dafb',
};

const outputStyle = {
  backgroundColor: '#1e1e2f',
  padding: '15px',
  borderRadius: '8px',
  color: '#dcdcdc',
  fontFamily: 'monospace',
  fontSize: '16px',
  whiteSpace: 'pre-wrap' as const,
  height: 'calc(100vh - 300px)',
  overflowY: 'auto' as const,
};

export default CodeEditor;
