const form = document.getElementById("regForm");
const live = document.getElementById("live");
const cards = document.getElementById("cards");
const tableBody = document.querySelector("#summary tbody");
const themeToggle = document.getElementById('themeToggle');

// Theme: load preference from localStorage
function applyTheme(isDark){
  if(isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  if(themeToggle) themeToggle.setAttribute('aria-pressed', String(!!isDark));
}
const saved = localStorage.getItem('prefers-dark');
if(saved !== null){
  applyTheme(saved === '1');
}
else{
  // prefer system dark
  const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefers);
}
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('prefers-dark', isDark ? '1' : '0');
    themeToggle.setAttribute('aria-pressed', String(!!isDark));
  });
}
// keyboard shortcut: press 't' to toggle theme
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 't' && !(e.metaKey||e.ctrlKey||e.altKey)){
    e.preventDefault();
    if(themeToggle) themeToggle.click();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  live.textContent = "";

  const data = {
    first: document.getElementById("first").value.trim(),
    last: document.getElementById("last").value.trim(),
    email: document.getElementById("email").value.trim(),
    prog: document.getElementById("prog").value.trim(),
    year: document.querySelector("input[name='year']:checked")?.value,
    interests: document.getElementById("interests").value.split(",").map(i => i.trim()).filter(i => i),
    photo: document.getElementById("photo").value.trim()
  };

  // Validation
  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setErr = (id, msg) => {
    document.getElementById(id).textContent = msg;
    if (msg) valid = false;
  };

  setErr("err-first", data.first ? "" : "Required");
  setErr("err-last", data.last ? "" : "Required");
  setErr("err-email", emailPattern.test(data.email) ? "" : "Invalid email");
  setErr("err-prog", data.prog ? "" : "Required");
  setErr("err-year", data.year ? "" : "Select a year");

  if (!valid) {
    live.textContent = "Please fix errors before submitting.";
    return;
  }

  addEntry(data);
  form.reset();
  live.textContent = "Student added successfully!";
});

function addEntry(data) {
  // Create card
  const card = document.createElement("div");
  card.className = "card-person";
  card.innerHTML = `
    <img src="${data.photo || "https://placehold.co/150"}" alt="${data.first}">
    <div><h3>${data.first} ${data.last}</h3>
    <p><span class="badge">${data.prog}</span> <span class="badge">Year ${data.year}</span></p>
    <p>${data.interests.join(", ")}</p>
    <button class="remove">Remove</button></div>
  `;
  // tiny entrance animation
  card.style.opacity = 0;
  card.style.transform = 'translateY(8px)';
  cards.prepend(card);
  requestAnimationFrame(()=>{
    card.style.transition = 'transform 220ms ease, opacity 220ms ease';
    card.style.opacity = 1;
    card.style.transform = 'translateY(0)';
  });

  // Create table row
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.first} ${data.last}</td>
    <td>${data.prog}</td>
    <td>${data.year}</td>
    <td>${data.interests.join(", ")}</td>
    <td><button class="remove">Remove</button></td>
  `;
  tableBody.prepend(tr);

  // Remove button
  card.querySelector(".remove").addEventListener("click", () => {
    card.remove();
    tr.remove();
  });
  tr.querySelector(".remove").addEventListener("click", () => {
    card.remove();
    tr.remove();
  });
}
