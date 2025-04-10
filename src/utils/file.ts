import fs from 'fs';

const readJson = (filename: string = "list.json"): {} => {
    if (!fs.existsSync(filename)) {
        // If the file does not exist, create an empty array
        fs.writeFileSync(filename, '{}', 'utf-8');
    }
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
}

// Function to write JSON file
const writeJson = (data: {}, filename: string = "list.json",): void => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 4), 'utf-8');
}


export {
    readJson,
    writeJson,
}