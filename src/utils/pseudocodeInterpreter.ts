type Variables = { [key: string]: any };
type FunctionDef = {
  params: string[];
  body: string[];
};

export class PseudocodeInterpreter {
  private variables: { [key: string]: any } = {};
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
    } else if (line.startsWith('PROCEDURE') || line.startsWith('FUNCTION')) {
      return this.defineFunction(line, lines, index);
    } else if (line.startsWith('CALL')) {
      return this.callProcedure(line);
    } else if (this.functions[line.split('(')[0].trim()]) {
      return this.callFunction(line);
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
    // Handle string concatenation with '&' operator
    if (expression.includes('&')) {
      const parts = expression.split('&').map(part => part.trim());
      const evaluatedParts = parts.map(part => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return part.slice(1, -1); // Keep string literals as is, removing quotes
        } else {
          return this.evaluateExpression(part); // Evaluate variables or other expressions
        }
      });
      return evaluatedParts.join(''); // Join evaluated parts as a single concatenated string
    }

    // Handle single string literal (return without processing further)
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1); // Strip quotes and return literal
    }

    // Check if the expression is a variable
    if (this.variables.hasOwnProperty(expression)) {
      return this.variables[expression];
    }

    // Check if the expression is a numeric value
    if (!isNaN(Number(expression))) {
      return Number(expression);
    }

    // Handle comparison expressions (e.g., "<", ">", "<=", ">=", "!=")
    const comparisonPattern = /^(.+?)\s*(<=|>=|<|>|!=|==|=)\s*(.+)$/; // Ensure multi-character operators like ">=" are matched first
    const comparisonMatch = expression.match(comparisonPattern);
    if (comparisonMatch) {
      const [, left, operator, right] = comparisonMatch;
      const leftValue = this.evaluateExpression(left.trim());
      const rightValue = this.evaluateExpression(right.trim());
      console.log("hello yahan aya")
      switch (operator) {
        case '<':
          return leftValue < rightValue;
        case '>':
          return leftValue > rightValue;
        case '<=':
          return leftValue <= rightValue;
        case '>=':
          return leftValue >= rightValue;
        case '!=':
          return leftValue != rightValue;
        case '=':
          return leftValue == rightValue;
        case '==': // Support both single and double equals
          return leftValue == rightValue;
        case '+': return leftValue + rightValue;
        case '-': return leftValue - rightValue;
        case '*': return leftValue * rightValue;
        case '/': return leftValue / rightValue;
        default:
          return `Unsupported operator: ${operator}`;
      }
    }

    // Handle MOD keyword for modulus
    const modPattern = /^(.+?)\s+MOD\s+(.+)$/i;
    const modMatch = expression.match(modPattern);
    if (modMatch) {
      const [, left, right] = modMatch;
      const leftValue = this.evaluateExpression(left.trim());
      const rightValue = this.evaluateExpression(right.trim());
      return leftValue % rightValue; // Return the modulus value
    }

    // Evaluate arithmetic expressions (e.g., "num1 + num2")
    try {
      for (const [key, value] of Object.entries(this.variables)) {
        expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
      }

      // If purely arithmetic, safely evaluate
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
      const parts = expression.split(',').map(part => part.trim());
      const evaluatedParts = parts.map(part => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return part.slice(1, -1);
        } else {
          const value = this.evaluateExpression(part);
          if (typeof value === 'string' && value.startsWith('Error')) {
            return value;
          }
          return value !== undefined ? value.toString() : `Error: Undefined variable or expression (${part})`;
        }
      });
      const errorPart = evaluatedParts.find(part => part.startsWith('Error'));
      if (errorPart) {
        return errorPart;
      }
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

  // Method to define a procedure or function
  defineFunction(line: string, lines: string[], index: number): number {
    const funcPattern = /^FUNCTION\s+(\w+)\(([^)]*)\)/;
    const match = line.match(funcPattern);

    if (match) {
      const [, funcName, paramList] = match;
      const params = paramList.split(',').map(param => param.trim());
      const body: string[] = [];

      // Collect the body of the function
      let i = index + 1;
      while (i < lines.length && !lines[i].startsWith('END FUNCTION')) {
        body.push(lines[i].trim());
        i++;
      }

      // Store the function in the interpreter
      this.functions[funcName] = { params, body };
      return i;  // Return the index where "END FUNCTION" is found
    }

    return index;
  }



  // Method to call a procedure
  private callProcedure(line: string): string {
    const callPattern = /^CALL\s+(\w+)\(([^)]*)\)/;
    const match = line.match(callPattern);

    if (match) {
      const [, name, argList] = match;
      const args = argList.split(',').map(arg => this.evaluateExpression(arg.trim()));
      const funcDef = this.functions[name];
      if (funcDef) {
        console.log(`Calling procedure "${name}" with arguments [${args.join(', ')}]`);  // Debug output

        // Save existing variable state and set procedure parameters
        const savedVariables = { ...this.variables };
        funcDef.params.forEach((param, i) => this.variables[param] = args[i]);

        // Execute each line in the procedure body
        for (let i = 0; i < funcDef.body.length; i++) {
          const bodyLine = funcDef.body[i];
          console.log(`Executing line in procedure "${name}": ${bodyLine}`);  // Debug output
          const result = this.executeLine(bodyLine, funcDef.body, i);
          if (typeof result === 'string' && result.startsWith('Error')) {
            console.error(result);
          }
        }

        // Restore variable state
        this.variables = savedVariables;
        return `Procedure ${name} executed`;
      }
      return `Error: Procedure ${name} not found`;
    }

    return `Error: Invalid procedure call format`;
  }



  callFunction(line: string): any {
    const funcPattern = /^(\w+)\(([^)]*)\)/;
    const match = line.match(funcPattern);

    if (match) {
      const [, name, argList] = match;
      const args = argList.split(',').map(arg => this.evaluateExpression(arg.trim()));
      const funcDef = this.functions[name];

      if (funcDef) {
        const savedVariables = { ...this.variables };

        // Assign the function arguments to the variables
        funcDef.params.forEach((param, i) => this.variables[param] = args[i]);

        let result;
        for (const bodyLine of funcDef.body) {
          if (bodyLine.startsWith("RETURN")) {
            result = this.evaluateExpression(bodyLine.replace("RETURN", "").trim());
            break;
          }
        }

        this.variables = savedVariables;  // Restore the previous state
        return result;
      }

      return `Error: Function ${name} not found`;
    }

    return `Error: Invalid function call format`;
  }


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
        return i;
      }

      if (blockExecuted) {
        while (i < lines.length && !lines[i].trim().match(endifPattern)) {
          i++;
        }
        return i;
      }
    }

    return index;
  }

  private executeBlock(lines: string[], startIndex: number): number {
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("ELSE") || line.startsWith("ENDIF")) {
        return i - 1;
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
