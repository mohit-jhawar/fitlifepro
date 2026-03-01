const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/exercises.json', 'utf8'));
const targetMuscles = [...new Set(data.map(e => e.targetMuscle))];
const categories = [...new Set(data.map(e => e.category))];
const equipment = [...new Set(data.map(e => e.equipment))];
console.log("Muscles:", targetMuscles);
console.log("Categories:", categories);
console.log("Equipment:", equipment);
