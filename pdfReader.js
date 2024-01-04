const fs = require('fs');

const data = {};

for (let i = 100; i <= 200; i++) {
    const key = i.toString();
    const value = String.fromCharCode(65 + (i % 4));
    data[key] = value;
}

const jsonData = JSON.stringify(data, null, 2);

fs.writeFileSync('reading.json', jsonData);