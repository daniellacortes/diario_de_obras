const workersDiv = document.getElementById("workers");
const saveFormBtn = document.getElementById("saveForm");
const workerRegisterModal = document.getElementById("workerModalRegister");
const workerRegisterInstance =
  bootstrap.Modal.getOrCreateInstance(workerRegisterModal);
const workersModal = document.getElementById("workerModal");

//Show photo
const inputImage = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");

inputImage.addEventListener("change", function () {
  const files = Array.from(this.files);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const col = document.createElement("div");
      col.classList.add("col-6", "col-md-3");

      col.innerHTML = `
                <div class="card shadow-sm position-relative">
                    <button type="button" class="btn btn-success btn-sm position-absolute top-0 end-0 m-1 remove-btn">
                        &times;
                    </button>
                    <img src="${e.target.result}" class="card-img-top" alt="Imagem">
                    <div class="card-body p-2">
                        <p class="small text-muted mb-0 text-truncate">${file.name}</p>
                    </div>
                </div>
            `;

      previewContainer.appendChild(col);

      col.querySelector(".remove-btn").addEventListener("click", () => {
        col.remove();
      });
    };
    reader.readAsDataURL(file);
  });
});


// Show workers at modal

const workersInstance = bootstrap.Modal.getOrCreateInstance(workersModal);

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

  workersInstance.show();
});


//Search
const search = document.getElementById("searchWorker");

search.addEventListener("input", () => {
  const filter = search.value.toLowerCase();

  const rows = workersDiv.querySelectorAll(".row");

  rows.forEach((row) => {
    const label = row.querySelector("label").textContent.toLowerCase();

    if (label.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});


//Show names at daily
const saveWorkerBtn = document.getElementById("saveWorkerModal");
const workerModalInstance = bootstrap.Modal.getOrCreateInstance(workersModal);
const workersDailyContainer = document.getElementById("workersDaily");

saveWorkerBtn.addEventListener("click", () => {

  const selectedWorkers = workersModal.querySelectorAll(
    ".worker-checkbox:checked"
  );

  selectedWorkers.forEach((checkbox) => {
    const label = workersModal.querySelector(
      `label[for="${checkbox.id}"]`
    ).textContent;

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "mx-3", "pt-4");

    rowDiv.innerHTML = `
      <div class="col-5">
        <input type="text" class="form-control bg-light" value="${label}" disabled>
      </div>
      <div class="col-3">
        <input type="time" class="form-control bg-light">
      </div>
      <div class="col-3">
        <input type="time" class="form-control bg-light">
      </div>
      <div class="col-1">
        <button class="btn btn-success remove-btn" type="button">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    `;

    workersDailyContainer.appendChild(rowDiv);

    rowDiv.querySelector(".remove-btn").addEventListener("click", () => {
      rowDiv.remove();
    });

    checkbox.checked = false;
  });

  workerModalInstance.hide();

});
