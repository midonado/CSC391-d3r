let csvToJson = require('convert-csv-to-json');

let fileInputName = '../public/dataFromClass.csv'; 
let fileOutputName = 'myOutputFile.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);