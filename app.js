'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.navlinks');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  initRoboGame();
});

function initRoboGame() {
  const form = document.getElementById('robo-form');
  if (!form) return;

  const food = [
    ['برجر أو ساندويتش', 1],
    ['أكل سعودي', 2],
    ['أكل عربي', 2],
    ['بيتزا أو باستا', 2],
    ['أكل آسيوي', 3],
    ['فطور', 3],
    ['مأكولات بحرية', 3],
    ['حلى أو مقهى', 3],
    ['مطبخ لم تجربه من قبل', 4],
    ['ROBO يختار نوع الأكل', 5]
  ];

  const restaurants = [
    ['أقرب مطعم', 1],
    ['مطعم تختاره أنت', 1],
    ['صديقك يختار', 2],
    ['شخص معك يختار', 2],
    ['مطعم محفوظ عندك', 2],
    ['خامس مطعم في البحث', 3],
    ['مطعم جديد في منطقتك', 3],
    ['مطعم لم تزره من قبل', 4],
    ['اختر ثلاثة وROBO يقرر', 4],
    ['ROBO يختار المطعم', 5]
  ];

  const dishes = [
    ['الأكثر طلبًا', 1],
    ['أول طبق في القسم', 1],
    ['ثالث طبق', 2],
    ['خامس طبق', 3],
    ['ترشيح الموظف', 3],
    ['طبق لم تجربه', 3],
    ['صديقك يختار الطبق', 3],
    ['أغرب طبق في المنيو', 4],
    ['اختيار الشيف المفاجئ', 4],
    ['ROBO يختار الطبق', 5]
  ];

  const currentMinute = document.getElementById('current-minute');
  const result = document.getElementById('result');
  const matrix = document.getElementById('matrix-wrap');
  const tableBody = document.querySelector('#matrix-table tbody');

  const refreshMinute = () => {
    currentMinute.textContent = String(new Date().getMinutes()).padStart(2, '0');
  };
  refreshMinute();
  window.setInterval(refreshMinute, 30000);

  for (let digit = 0; digit < 10; digit += 1) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${digit}</td>
      <td data-col="food" data-digit="${digit}"><div class="cell-choice"><span>${food[digit][0]}</span><small>${food[digit][1]} نقطة</small></div></td>
      <td data-col="restaurant" data-digit="${digit}"><div class="cell-choice"><span>${restaurants[digit][0]}</span><small>${restaurants[digit][1]} نقطة</small></div></td>
      <td data-col="dish" data-digit="${digit}"><div class="cell-choice"><span>${dishes[digit][0]}</span><small>${dishes[digit][1]} نقطة</small></div></td>
    `;
    tableBody.appendChild(row);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const battery = Number(document.getElementById('battery').value);
    const followers = Number(document.getElementById('followers').value);
    const minute = new Date().getMinutes();
    const digits = {
      food: battery % 10,
      restaurant: followers % 10,
      dish: minute % 10
    };
    const choices = {
      food: food[digits.food],
      restaurant: restaurants[digits.restaurant],
      dish: dishes[digits.dish]
    };
    const total = choices.food[1] + choices.restaurant[1] + choices.dish[1];
    const remaining = 10 - total;

    document.getElementById('food-result').textContent = choices.food[0];
    document.getElementById('restaurant-result').textContent = choices.restaurant[0];
    document.getElementById('dish-result').textContent = choices.dish[0];
    document.getElementById('total-points').textContent = total + ' / 15';
    document.getElementById('win-message').textContent = total >= 10
      ? 'هزمت ROBO هذه الجولة 🤖'
      : 'هذه الجولة لـROBO… تحتاج إلى ' + remaining + (remaining === 1 ? ' نقطة إضافية' : ' نقاط إضافية');

    document.querySelectorAll('#matrix-table td').forEach(cell => cell.classList.remove('selected-cell'));
    Object.entries(digits).forEach(([column, digit]) => {
      const cell = document.querySelector(`#matrix-table td[data-col="${column}"][data-digit="${digit}"]`);
      if (cell) cell.classList.add('selected-cell');
    });

    form.hidden = true;
    result.hidden = false;
    matrix.hidden = true;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('explain').addEventListener('click', () => {
    matrix.hidden = false;
    matrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('again').addEventListener('click', () => {
    result.hidden = true;
    matrix.hidden = true;
    form.hidden = false;
    form.reset();
    document.querySelectorAll('#matrix-table td').forEach(cell => cell.classList.remove('selected-cell'));
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
