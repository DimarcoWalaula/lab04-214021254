const form = document.getElementById("regForm");
const live = document.getElementById("live");
const cards = document.getElementById("cards");
const tableBody = document.querySelector("#summary tbody");
const themeToggle = document.getElementById('themeToggle');
const STORAGE_KEY = 'wad621s-profiles';

function readProfilesFromStorage(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeProfilesToStorage(profiles){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); } catch {}
}
function upsertProfileToStorage(profile){
  const profiles = readProfilesFromStorage();
  const index = profiles.findIndex(p => p.id === profile.id);
  if(index >= 0) profiles[index] = profile; else profiles.unshift(profile);
  writeProfilesToStorage(profiles);
}
function removeProfileFromStorage(id){
  const profiles = readProfilesFromStorage().filter(p => p.id !== id);
  writeProfilesToStorage(profiles);
}

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

  let firstInvalidElement = null;
  const markError = (inputId, errorId, message) => {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    errorEl.textContent = message;
    if (message) {
      valid = false;
      inputEl.setAttribute('aria-invalid', 'true');
      if (!firstInvalidElement) firstInvalidElement = inputEl;
    } else {
      inputEl.setAttribute('aria-invalid', 'false');
    }
  };

  markError("first", "err-first", data.first ? "" : "Required");
  markError("last", "err-last", data.last ? "" : "Required");
  markError("email", "err-email", emailPattern.test(data.email) ? "" : "Please enter a valid email.");
  markError("prog", "err-prog", data.prog ? "" : "Required");
  // year is a radio group; set error but aria-invalid handled on the first input
  const yearError = data.year ? "" : "Select a year";
  document.getElementById("err-year").textContent = yearError;
  if (!data.year) {
    valid = false;
    const firstYearInput = document.querySelector("input[name='year']");
    if (firstYearInput) {
      firstYearInput.setAttribute('aria-invalid', 'true');
      if (!firstInvalidElement) firstInvalidElement = firstYearInput;
    }
  } else {
    document.querySelectorAll("input[name='year']").forEach(el => el.setAttribute('aria-invalid', 'false'));
  }

  if (!valid) {
    live.textContent = "Please fix errors before submitting.";
    if (firstInvalidElement && typeof firstInvalidElement.focus === 'function') {
      firstInvalidElement.focus();
    }
    return;
  }

  // Assign an id for persistence
  data.id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  addEntry(data, { persist: true });
  form.reset();
  live.textContent = "Student added successfully!";
});

function addEntry(data, options = { persist: false }) {
  // Create card
  const card = document.createElement("div");
  card.className = "card-person";
  if (data.id) card.dataset.id = data.id;
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
  if (data.id) tr.dataset.id = data.id;
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
    if (data.id) removeProfileFromStorage(data.id);
  });
  tr.querySelector(".remove").addEventListener("click", () => {
    card.remove();
    tr.remove();
    if (data.id) removeProfileFromStorage(data.id);
  });

  if (options.persist) {
    upsertProfileToStorage(data);
  }
}

// Restore saved profiles on load
window.addEventListener('DOMContentLoaded', () => {
  const savedProfiles = readProfilesFromStorage();
  if (Array.isArray(savedProfiles) && savedProfiles.length > 0) {
    savedProfiles.forEach(p => addEntry(p, { persist: false }));
  }
});
