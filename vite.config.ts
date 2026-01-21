import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Plugin to save exercises to source file
function saveExercisesPlugin() {
  return {
    name: 'save-exercises',
    configureServer(server) {
      server.middlewares.use('/api/save-exercises', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { exercises } = JSON.parse(body);

              // Generate the exercises code
              const generateExerciseCode = (ex) => {
                const questionsCode = ex.questions.map(q =>
                  `      { id: "${q.id}", prompt: "${q.prompt}", audioPlaceholder: "${q.audioPlaceholder}", options: [${q.options.map(o => `"${o.replace(/"/g, '\\"')}"`).join(", ")}], correctAnswer: ${q.correctAnswer} }`
                ).join(",\n");

                return `  {
    id: "${ex.id}",
    title: "${ex.title}",
    description: "${ex.description}",
    category: "${ex.category}",${ex.shuffleQuestions ? '\n    shuffleQuestions: true,' : ''}
    difficulty: "${ex.difficulty}",
    type: "${ex.type}",
    duration: "${ex.duration}",
    questions: [
${questionsCode}
    ],
  }`;
              };

              const exercisesCode = exercises.map(generateExerciseCode).join(",\n");

              // Read current file
              const filePath = path.resolve(__dirname, './src/contexts/ExercisesContext.tsx');
              let content = fs.readFileSync(filePath, 'utf-8');

              // Find and replace the defaultExercises array
              const startMarker = 'const defaultExercises: Exercise[] = [';

              // Handle both Windows (\r\n) and Unix (\n) line endings
              const startIndex = content.indexOf(startMarker);
              const endMatch = content.match(/\];\s*\r?\n\s*\r?\nconst STORAGE_KEY/);
              const endIndex = endMatch ? content.indexOf(endMatch[0]) : -1;

              console.log('Save exercises: startIndex=', startIndex, 'endIndex=', endIndex, 'filePath=', filePath);

              if (startIndex !== -1 && endIndex !== -1) {
                const newContent = content.substring(0, startIndex + startMarker.length) +
                  '\n' + exercisesCode + '\n' +
                  content.substring(endIndex);

                fs.writeFileSync(filePath, newContent);

                // Bump version
                const versionMatch = newContent.match(/deepdive-exercises-v(\d+)/);
                if (versionMatch) {
                  const newVersion = parseInt(versionMatch[1]) + 1;
                  const updatedContent = newContent.replace(
                    /deepdive-exercises-v\d+/g,
                    `deepdive-exercises-v${newVersion}`
                  );
                  fs.writeFileSync(filePath, updatedContent);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } else {
                console.log('Save exercises failed: could not find markers. startIndex=', startIndex, 'endIndex=', endIndex);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Could not find markers: start=${startIndex}, end=${endIndex}` }));
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && saveExercisesPlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
