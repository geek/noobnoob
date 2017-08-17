'use strict';

const Fs = require('fs');
const Path = require('path');
const Cardinal = require('cardinal');
const Colors = require('ansicolors');


module.exports = Error.prepareStackTrace = function (error, structuredStackTrace) {
  const output = [''];
  output.push(Cardinal.highlight(`Error: '${error.message}'`));

  let isFirst = true;
  structuredStackTrace.forEach((stack) => {
    const functionName = stack.getFunctionName() || '<anonymous>';
    const typeName = stack.getTypeName();
    const formattedType = (!typeName || typeName === 'Module') ? '' : `${typeName}.`;

    const fileName = stack.getFileName();
    const lineNumber = stack.getLineNumber();

    if (fileName && fileName.indexOf(Path.sep) !== -1 && fileName.indexOf('node_modules') === -1) {
      output.push(`    at ${formattedType}${functionName} (${fileName}:${lineNumber}:${stack.getColumnNumber()})`);
      const file = Fs.readFileSync(fileName).toString();
      const fileParts = file.split('\n');
      const start = isFirst ? (lineNumber - 3) : (lineNumber - 2);
      const end = isFirst ? (lineNumber + 2) : (lineNumber + 1);
      formatCode(output, fileParts, start, end);

      output.push('');
      isFirst = false;
    } else {
      output.push(Colors.brightBlack(`    at ${formattedType}${functionName} (${fileName}:${lineNumber}:${stack.getColumnNumber()})`));
    }
  });

  output.push('');
  return output.join('\n');
};


function formatCode (output, fileParts, start, end) {
  for (let i = start; i < end; ++i) {
    if (i >= 0 && i < fileParts.length) {
      output.push(Cardinal.highlight(fileParts[i] || ' ', { linenos: true, firstline: i + 1 }));
    }
  }
}
