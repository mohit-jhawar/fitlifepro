const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

https.get(url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const raw = JSON.parse(rawData);

            const parsed = raw.map(ex => {
                let eq = (ex.equipment || "Bodyweight").toLowerCase();
                if (eq === 'body only') eq = 'bodyweight';

                return {
                    id: ex.id,
                    name: ex.name,
                    targetMuscle: ex.primaryMuscles ? ex.primaryMuscles[0].toLowerCase() : "full body",
                    equipment: eq,
                    difficulty: (ex.level || "Beginner").toLowerCase(),
                    instructions: ex.instructions || [],
                    category: (ex.category || "General").toLowerCase(),
                    gifUrl: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.id}/0.jpg`
                };
            });

            fs.writeFileSync('src/data/exercises.json', JSON.stringify(parsed, null, 2));
            console.log('✅ Successfully wrote correct schema to src/data/exercises.json');
        } catch (e) {
            console.error(e.message);
        }
    });
});
