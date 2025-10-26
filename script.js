//Current Date
const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today


//Change Icon
document.querySelectorAll('[data-toggle]').forEach(icone => {
    icone.style.cursor = "pointer";
    icone.addEventListener("click", () => {
        const states = icone.dataset.toggle.split('|');
        const current = icone.className;

        if (current.includes(states[0])) {
            icone.className = states[1];
        } else {
            icone.className = states[0];
        }
    });
});

//Show photo
const inputImage = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');

inputImage.addEventListener('change', function() {

    const files = Array.from(this.files);

    files.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const col = document.createElement('div');
            col.classList.add('col-6', 'col-md-3');

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

            // adiciona o card ao container
            previewContainer.appendChild(col);

            // adiciona evento de remoção
            col.querySelector('.remove-btn').addEventListener('click', () => {
                col.remove();
            });
        };
        reader.readAsDataURL(file);
    });
});