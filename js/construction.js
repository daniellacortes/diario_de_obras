// Show Workers
const workersDiv = document.getElementById("workersDiv");
const saveFormBtn = document.getElementById("formWorker");
const workerRegisterModal = document.getElementById("workerRegisterModal");
const workerRegisterInstance =
  bootstrap.Modal.getOrCreateInstance(workerRegisterModal);

saveFormBtn.addEventListener("click", () => {
  const name = document.getElementById("nameWorker").value.trim();
  if (!name) return;

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row", "pt-2", "mx-1");

  const id = "btn" + Date.now();

  rowDiv.innerHTML = `
    <input type="checkbox" class="btn-check worker-checkbox" autocomplete="off" id="${id}">
    <label class="btn btn-light" for="${id}">${name}</label>
  `;

  workersDiv.appendChild(rowDiv);

  workerRegisterInstance.hide();
});
