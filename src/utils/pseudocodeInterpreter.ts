// utils/PseudocodeInterpreter.ts

type Variables = { [key: string]: any };
type FunctionDef = { params: string[]; body: string[] };

export class PseudocodeInterpreter {
  private variables: Variables = {};
  private constants: Variables = {};
  private functions: { [key: string]: FunctionDef } = {};
  private outputLog: string[] = [];
  private inputQueue: any[] = [];

  constructor(inputQueue: any[] = []) {
    this.inputQueue = inputQueue;
  }

  public execute(code: string): string {
    const lines = code.split('\n');
    this.outputLog = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const result = this.executeLine(line, lines, i);
        if (typeof result === 'number') {
          i = result;
        }
      }
    }
    return this.outputLog.join('\n');
  }

  private executeLine(line: string, lines: string[], index: number): string | number {
    if (line.startsWith('DECLARE')) {
      return this.declareVariable(line);
    } else if (line.startsWith('CONSTANT')) {
      return this.declareConstant(line);
    } else if (line.startsWith('IF')) {
      return this.handleIfStatement(lines, index);
    } else if (line.startsWith('FOR')) {
      return this.handleForLoop(line, lines, index);
    } else if (line.startsWith('WHILE')) {
      return this.handleWhileLoop(line, lines, index);
    } else if (line.startsWith('REPEAT')) {
      return this.handleRepeatLoop(line, lines, index);
    } else if (line.startsWith('OUTPUT')) {
      return this.outputStatement(line);
    } else if (line.startsWith('INPUT')) {
      return this.inputStatement(line);
    } else if (line.includes('←')) {
      return this.assignValue(line);
    }
    return `Error: Unknown statement "${line}"`;
  }

  private declareVariable(line: string): string {
    const pattern = /^DECLARE\s+(\w+)\s*:\s*(\w+)/;
    const match = line.match(pattern);
    if (match) {
      const [, varName, dataType] = match;
      this.variables[varName] = this.getDefaultValue(dataType);
      return `Declared ${varName} as ${dataType}`;
    }
    return `Error: Invalid variable declaration format`;
  }

  private declareConstant(line: string): string {
    const pattern = /^CONSTANT\s+(\w+)\s*=\s*(.+)/;
    const match = line.match(pattern);
    if (match) {
      const [, constName, value] = match;
      this.constants[constName] = this.evaluateExpression(value);
      return `Declared constant ${constName}`;
    }
    return `Error: Invalid constant declaration format`;
  }

  private assignValue(line: string): string {
    const pattern = /^(\w+)\s*←\s*(.+)$/;
    const match = line.match(pattern);
    if (match) {
      const [, varName, value] = match;
      const evaluatedValue = this.evaluateExpression(value);
      if (this.constants[varName] !== undefined) {
        return `Error: Cannot assign to a constant (${varName})`;
      }
      this.variables[varName] = evaluatedValue;
      return `Assigned ${evaluatedValue} to ${varName}`;
    }
    return `Error: Invalid assignment format`;
  }

  private evaluateExpression(expression: string): any {
    // Check if the expression is a variable
    if (this.variables.hasOwnProperty(expression)) {
      return this.variables[expression];
    }

    // Check if the expression is a numeric value
    if (!isNaN(Number(expression))) {
      return Number(expression);
    }

    // Check if the expression is a string literal (e.g., "add")
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1);
    }

    // Check for equality comparison like 'num1 = 2'
    const equalityPattern = /^(\w+)\s*=\s*(.+)$/;
    const match = expression.match(equalityPattern);
    if (match) {
      const [, varName, value] = match;
      if (this.variables[varName] !== undefined) {
        return this.variables[varName] === this.evaluateExpression(value);
      }
      return false; // Return false if the variable doesn't match the value
    }

    // Evaluate arithmetic expressions like 'num1 + num2'
    try {
      // Replace variable names in the expression with their values
      for (const [key, value] of Object.entries(this.variables)) {
        expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
      }

      // Only evaluate if the expression is purely arithmetic
      if (/^[\d+\-*/().\s]+$/.test(expression)) {
        return eval(expression);
      }

      return `Error evaluating expression: ${expression}`;
    } catch (e) {
      return `Error evaluating expression: ${expression}`;
    }
  }




  private outputStatement(line: string): string {
    const pattern = /^OUTPUT\s+(.+)/;
    const match = line.match(pattern);
    if (match) {
      const expression = match[1];
      // Split the expression by commas and trim whitespace
      const parts = expression.split(',').map(part => part.trim());

      // Evaluate each part separately
      const evaluatedParts = parts.map(part => {
        if (part.startsWith('"') && part.endsWith('"')) {
          // It's a string literal, so remove the quotes and return it directly
          return part.slice(1, -1);
        } else {
          // Otherwise, evaluate as an expression or variable
          const value = this.evaluateExpression(part);
          if (typeof value === 'string' && value.startsWith('Error')) {
            return value; // Return the error if there's an issue with evaluation
          }
          return value !== undefined ? value.toString() : `Error: Undefined variable or expression (${part})`;
        }
      });

      // If any part contains an error, return that error message
      const errorPart = evaluatedParts.find(part => part.startsWith('Error'));
      if (errorPart) {
        return errorPart;
      }

      // Concatenate the evaluated parts into a single string
      const output = evaluatedParts.join(' ');
      this.outputLog.push(output);
      return '';
    }
    return `Error: Invalid OUTPUT statement format`;
  }


  private inputStatement(line: string): string {
    const pattern = /^INPUT\s+(\w+)/;
    const match = line.match(pattern);
    if (match) {
      const varName = match[1];
      if (this.inputQueue.length > 0) {
        let inputValue = this.inputQueue.shift();

        // Convert to a number if the variable is of type REAL or INTEGER
        if (!isNaN(Number(inputValue))) {
          inputValue = parseFloat(inputValue);
        }

        this.variables[varName] = inputValue;
        return `Assigned ${inputValue} to ${varName}`;
      } else {
        return `Error: No input available for ${varName}`;
      }
    }
    return `Error: Invalid INPUT statement format`;
  }


  // Method to handle IF-ELSE IF-ELSE logic
  private handleIfStatement(lines: string[], index: number): number {
    const ifPattern = /^IF\s+(.+)\s+THEN$/;
    const elsePattern = /^ELSE$/;
    const endifPattern = /^ENDIF$/;

    let blockExecuted = false;

    for (let i = index; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(ifPattern) && !blockExecuted) {
        const [, condition] = line.match(ifPattern) || [];
        if (this.evaluateExpression(condition)) {
          blockExecuted = true;
          i = this.executeBlock(lines, i + 1);
        }
      } else if (line.match(elsePattern) && !blockExecuted) {
        blockExecuted = true;
        i = this.executeBlock(lines, i + 1);
      } else if (line.match(endifPattern)) {
        // End the IF block
        return i;
      }

      // If a block was executed, skip to ENDIF
      if (blockExecuted) {
        while (i < lines.length && !lines[i].trim().match(endifPattern)) {
          i++;
        }
        return i; // Return the index where ENDIF was found
      }
    }

    return index;
  }

  // Helper method to execute a block of lines
  private executeBlock(lines: string[], startIndex: number): number {
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("ELSE") || line.startsWith("ENDIF")) {
        return i - 1; // Return the previous line before ELSE or ENDIF
      }
      this.executeLine(line, lines, i);
    }
    return lines.length - 1;
  }







  private handleForLoop(line: string, lines: string[], index: number): number {
    const forPattern = /^FOR\s+(\w+)\s+←\s+(\d+)\s+TO\s+(\d+)$/;
    const match = line.match(forPattern);
    if (match) {
      const [, varName, start, end] = match;
      const startVal = parseInt(start);
      const endVal = parseInt(end);
      for (let i = startVal; i <= endVal; i++) {
        this.variables[varName] = i;
        for (let j = index + 1; j < lines.length; j++) {
          const loopLine = lines[j].trim();
          if (loopLine.startsWith('NEXT')) {
            break;
          }
          this.executeLine(loopLine, lines, j);
        }
      }
      for (let i = index + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith('NEXT')) {
          return i;
        }
      }
    }
    return index;
  }

  private handleWhileLoop(line: string, lines: string[], index: number): number {
    const whilePattern = /^WHILE\s+(.+)$/;
    const match = line.match(whilePattern);
    if (match) {
      const condition = match[1];
      while (this.evaluateExpression(condition)) {
        for (let i = index + 1; i < lines.length; i++) {
          const loopLine = lines[i].trim();
          if (loopLine.startsWith('ENDWHILE')) {
            break;
          }
          this.executeLine(loopLine, lines, i);
        }
      }
      for (let i = index + 1; i < lines.length; i++) {
        if (lines[i].trim().startsWith('ENDWHILE')) {
          return i;
        }
      }
    }
    return index;
  }

  private handleRepeatLoop(line: string, lines: string[], index: number): number {
    let i = index + 1;
    while (true) {
      const loopLine = lines[i].trim();
      if (loopLine.startsWith('UNTIL')) {
        const condition = loopLine.replace('UNTIL', '').trim();
        if (this.evaluateExpression(condition)) {
          return i;
        }
        i = index + 1;
      } else {
        this.executeLine(loopLine, lines, i);
        i++;
      }
    }
  }

  private getDefaultValue(dataType: string): any {
    switch (dataType) {
      case 'INTEGER':
        return 0;
      case 'REAL':
        return 0.0;
      case 'STRING':
        return '';
      case 'BOOLEAN':
        return false;
      default:
        return null;
    }
  }
}
