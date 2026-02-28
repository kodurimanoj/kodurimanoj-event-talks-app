const fs = require('fs');

const talks = fs.readFileSync('data/talks.json', 'utf-8');
const css = fs.readFileSync('src/style.css', 'utf-8');
const js = fs.readFileSync('src/script.js', 'utf-8');
let html = fs.readFileSync('src/index.html', 'utf-8');

// Replace link to css with inline style
html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`);

// Embed talks data into the script and replace the script tag
const embeddedJs = `
  document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchInput = document.getElementById('search');

    const talks = ${talks};

    const schedule = [
      { time: '10:00 AM - 11:00 AM', type: 'talk' },
      { time: '11:00 AM - 11:10 AM', title: 'Break', type: 'break' },
      { time: '11:10 AM - 12:10 PM', type: 'talk' },
      { time: '12:10 PM - 12:20 PM', title: 'Break', type: 'break' },
      { time: '12:20 PM - 1:20 PM', type: 'talk' },
      { time: '1:20 PM - 2:20 PM', title: 'Lunch Break', type: 'break' },
      { time: '2:20 PM - 3:20 PM', type: 'talk' },
      { time: '3:20 PM - 3:30 PM', title: 'Break', type: 'break' },
      { time: '3:30 PM - 4:30 PM', type: 'talk' },
      { time: '4:30 PM - 4:40 PM', title: 'Break', type: 'break' },
      { time: '4:40 PM - 5:40 PM', type: 'talk' },
    ];
    
    renderSchedule(talks);

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      // Create a new array of talks that match the search criteria.
      const filteredTalks = talks.map(talk => {
        const isMatch = talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
        return isMatch ? talk : null;
      });
      renderSchedule(filteredTalks);
    });

    function renderSchedule(displayTalks) {
      scheduleContainer.innerHTML = '';
      let talkIndex = 0;
      schedule.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');

        if (item.type === 'talk') {
          // Find the next available talk in the displayTalks array.
          while (talkIndex < displayTalks.length && !displayTalks[talkIndex]) {
            talkIndex++;
          }
          if (talkIndex < displayTalks.length) {
            const talk = displayTalks[talkIndex];
            scheduleItem.innerHTML = \`
              <p class="time">\${item.time}</p>
              <h2>\${talk.title}</h2>
              <p class="speakers">\${talk.speakers.join(', ')}</p>
              <p>\${talk.description}</p>
              <p class="category">Categories: \${talk.category.map(cat => \`<span>\${cat}</span>\`).join('')}</p>
            \`;
            talkIndex++;
          } else {
            // If there are no more talks to display in a talk slot, you might want to show an empty slot or a message.
            // For now, we'll just skip it.
            return;
          }
        } else {
          scheduleItem.innerHTML = \`
            <p class="time">\${item.time}</p>
            <h2>\${item.title}</h2>
          \`;
        }
        scheduleContainer.appendChild(scheduleItem);
      });
    }
  });
`;

html = html.replace('<script src="script.js"></script>', `<script>${embeddedJs}</script>`);

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/index.html', html);

console.log('Website built to dist/index.html');
