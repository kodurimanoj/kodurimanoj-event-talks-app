document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchInput = document.getElementById('search');

  let talks = [];

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

  fetch('../data/talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk =>
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(displayTalks) {
    scheduleContainer.innerHTML = '';
    let talkIndex = 0;
    schedule.forEach(item => {
      const scheduleItem = document.createElement('div');
      scheduleItem.classList.add('schedule-item');

      if (item.type === 'talk') {
        if (talkIndex < displayTalks.length) {
          const talk = displayTalks[talkIndex];
          if (!talk) {
            talkIndex++;
            return;
          }
          scheduleItem.innerHTML = `
            <p class="time">${item.time}</p>
            <h2>${talk.title}</h2>
            <p class="speakers">${talk.speakers.join(', ')}</p>
            <p>${talk.description}</p>
            <p class="category">Categories: ${talk.category.map(cat => `<span>${cat}</span>`).join('')}</p>
          `;
          talkIndex++;
        }
      } else {
        scheduleItem.innerHTML = `
          <p class="time">${item.time}</p>
          <h2>${item.title}</h2>
        `;
      }
      scheduleContainer.appendChild(scheduleItem);
    });
  }
});
