//Current Date
const today = new Date().toISOString().split("T")[0];
const inputs = document.querySelectorAll(".currentDate");

inputs.forEach((input) => {
  input.value = today;
});

//Change Icon
document.querySelectorAll("[data-toggle]").forEach((icone) => {
  icone.style.cursor = "pointer";
  icone.addEventListener("click", () => {
    const states = icone.dataset.toggle.split("|");
    const current = icone.className;

    if (current.includes(states[0])) {
      icone.className = states[1];
    } else {
      icone.className = states[0];
    }
  });
});

//Current Time

const timeInputs = document.querySelectorAll(".currentTime");

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

timeInputs.forEach((input) => {
  input.value = getCurrentTime();
});

