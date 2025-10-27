// Workers
let workers = [];
let editingWorkerId = null;

const workersDiv = document.getElementById("workersDiv");
const formWorker = document.getElementById("formWorker");
const saveWorkerButton = document.getElementById("saveWorkerButton");
const workerRegisterModalElement = document.getElementById(
  "workerRegisterModal"
);
const workerRegisterModalLabel = document.getElementById(
  "workerRegisterModalLabel"
);
const workerRegisterInstance = new bootstrap.Modal(workerRegisterModalElement);

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function resetModalState() {
  editingWorkerId = null;
  if (workerRegisterModalLabel)
    workerRegisterModalLabel.textContent = "Cadastrar Novo Trabalhador";
  if (saveWorkerButton) saveWorkerButton.textContent = "Salvar";
  formWorker.reset();

  const dateInput = document.getElementById("dateStartWorker");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
}

function createWorkerCard(worker) {
  const formattedDate = formatDate(worker.dateStartWorker);
  const cardId = worker.id;

  const cardContainer = document.createElement("div");
  cardContainer.className = "col-12 mb-4";
  cardContainer.setAttribute("data-worker-id", cardId);

  cardContainer.innerHTML = `
        <div class="card bg-light">
            <div class="card-body">
                <div class="d-flex flex-column flex-sm-row ms-3 justify-content-end mb-2">
                    <!-- Botão de Editar (Placeholder) -->
                    <button type="button"
                        class="btn btn-sm btn-outline-secondary border-0 edit-worker-btn text-success"
                        data-card-id="${cardId}" aria-label="Editar Trabalhador">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <!-- Botão de Excluir -->
                    <button type="button" class="btn-close text-success ms-2 delete-worker-btn"
                        aria-label="Excluir Trabalhador" data-card-id="${cardId}">
                    </button>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <p class="fs-5">Nome: <strong>${
                          worker.nameWorker || "N/A"
                        }</strong></p>
                    </div>
                    <div class="col-sm-6 text-sm-end">
                        <p class="fs-5">Função: <strong>${
                          worker.jobFunction || "N/A"
                        }</strong></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <p class="fs-5">Data de início: <strong>${
                          formattedDate || "N/A"
                        }</strong></p>
                    </div>
                    <div class="col-sm-6 text-sm-end">
                        <p class="fs-5">Expediente: <strong>${
                          worker.startTimeWorker || "N/A"
                        } às ${worker.endTimeWorker || "N/A"}</strong></p>
                    </div>
                </div>
            </div>
        </div>
    `;

  cardContainer
    .querySelector(".delete-worker-btn")
    .addEventListener("click", () => {
      deleteWorker(cardId);
    });

  cardContainer
    .querySelector(".edit-worker-btn")
    .addEventListener("click", () => {
      editWorker(cardId);
    });

  return cardContainer;
}

function renderWorkers() {
  workersDiv.innerHTML = "";

  if (workers.length === 0) {
    workersDiv.innerHTML =
      '<p class="text-center text-muted mt-5">Nenhum trabalhador cadastrado ainda.</p>';
    return;
  }

  workers.forEach((worker) => {
    const card = createWorkerCard(worker);
    workersDiv.appendChild(card);
  });
}

function editWorker(workerId) {
  const workerToEdit = workers.find((w) => w.id === workerId);

  if (!workerToEdit) {
    return;
  }

  editingWorkerId = workerId;

  document.getElementById("nameWorker").value = workerToEdit.nameWorker || "";
  document.getElementById("jobFunction").value = workerToEdit.jobFunction || "";
  document.getElementById("dateStartWorker").value =
    workerToEdit.dateStartWorker || "";
  document.getElementById("startTimeWorker").value =
    workerToEdit.startTimeWorker || "";
  document.getElementById("endTimeWorker").value =
    workerToEdit.endTimeWorker || "";

  if (workerRegisterModalLabel)
    workerRegisterModalLabel.textContent = "Editar Trabalhador";
  if (saveWorkerButton) saveWorkerButton.textContent = "Atualizar";

  workerRegisterInstance.show();
}

function saveWorker(event) {
  event.preventDefault();

  const nameWorker = document.getElementById("nameWorker").value.trim();
  if (!nameWorker) return;

  const jobFunction = document.getElementById("jobFunction").value.trim();
  const dateStartWorker = document.getElementById("dateStartWorker").value;
  const startTimeWorker = document.getElementById("startTimeWorker").value;
  const endTimeWorker = document.getElementById("endTimeWorker").value;

  const workerData = {
    nameWorker,
    jobFunction,
    dateStartWorker,
    startTimeWorker,
    endTimeWorker,
  };

  if (editingWorkerId) {
    const workerIndex = workers.findIndex((w) => w.id === editingWorkerId);

    if (workerIndex !== -1) {
      workers[workerIndex] = { ...workers[workerIndex], ...workerData };
    }
  } else {
    const newWorker = {
      id: crypto.randomUUID(),
      ...workerData,
    };
    workers.push(newWorker);
  }

  renderWorkers();
  workerRegisterInstance.hide();
  resetModalState();
}

function deleteWorker(workerId) {
  const initialLength = workers.length;
  workers = workers.filter((worker) => worker.id !== workerId);

  if (workers.length < initialLength) {
    renderWorkers();
  }
}

formWorker.addEventListener("submit", saveWorker);

workerRegisterModalElement.addEventListener("hidden.bs.modal", resetModalState);

document.addEventListener("DOMContentLoaded", () => {
  resetModalState();
  renderWorkers();
});

// ZipCode
const zipCodeInput = document.getElementById("zipCode");
const addressInput = document.getElementById("address");
const neighborhoodInput = document.getElementById("nbhd");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");

const zipCodeMessageElement = document.getElementById("zipCodeMessage");

function displayZipCodeMessage(message, isSuccess = true) {
  if (zipCodeMessageElement) {
    zipCodeMessageElement.textContent = message;
    zipCodeMessageElement.className = isSuccess
      ? "text-sm text-green-600 font-medium mt-1"
      : "text-sm text-red-600 font-medium mt-1";

      setTimeout(() => {
      zipCodeMessageElement.textContent = "";
      zipCodeMessageElement.className = "";
    }, 5000);
  }
}

function normalizeZipCode(value) {
  return value.replace(/\D/g, "");
}

async function searchZipCode() {
  const zipCode = normalizeZipCode(zipCodeInput.value);

  if (zipCode.length !== 8) {
    return;
  }

  addressInput.value = "Buscando...";
  neighborhoodInput.value = "";
  cityInput.value = "Buscando...";
  stateInput.value = "";

  try {
    const apiUrl = `https://viacep.com.br/ws/${zipCode}/json/`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.erro) {
      displayZipCodeMessage("CEP não encontrado ou inválido.", false);

      addressInput.value = "";
      neighborhoodInput.value = "";
      cityInput.value = "";
      stateInput.value = "";
    } else {
      addressInput.value = data.logradouro || "";
      neighborhoodInput.value = data.bairro || "";
      cityInput.value = data.localidade || "";
      stateInput.value = data.uf || "";
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    displayZipCodeMessage("Erro na comunicação com o serviço de CEP.", false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (zipCodeInput) {
    zipCodeInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 5) {
        value = value.substring(0, 5) + "-" + value.substring(5, 8);
      }
      e.target.value = value;
    });

    zipCodeInput.addEventListener("blur", searchZipCode);
  }
});
