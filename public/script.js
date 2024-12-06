const form = document.getElementById('create-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];

let currentEditingItem = null; // Variable para almacenar el ítem que estamos editando

// Función para obtener todos los ítems
const getItems = async () => {
    const response = await fetch('http://localhost:3000/items');
    const items = await response.json();
    displayItems(items);
};

// Función para mostrar los ítems en la tabla
const displayItems = (items) => {
    // Limpiar la tabla antes de mostrar los nuevos ítems
    tableBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>
                <button onclick="editItem('${item._id}', '${item.name}', '${item.email}')">Editar</button>
                <button onclick="deleteItem('${item._id}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

// Función para crear un nuevo ítem
const createItem = async (name, email) => {
    const response = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
    });
    const newItem = await response.json();
    return newItem;
};

// Función para eliminar un ítem
const deleteItem = async (id) => {
    const response = await fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        // Eliminar el ítem de la tabla después de eliminarlo en el backend
        getItems();
    }
};

// Maneja el evento de envío del formulario para crear o editar un ítem
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Validación de campos
    if (!name || !email) {
        alert("Por favor, completa todos los campos.");
        return; // Si alguno de los campos está vacío, se detiene el proceso
    }

    if (currentEditingItem) {
        // Si estamos editando un ítem, actualizamos en lugar de crear uno nuevo
        await updateItem(currentEditingItem._id, { name, email });
    } else {
        // Crear el ítem
        await createItem(name, email);
    }

    // Limpiar los campos del formulario
    nameInput.value = '';
    emailInput.value = '';
    currentEditingItem = null; // Limpiar la variable de ítem en edición

    // Actualizar la lista de ítems
    getItems();
});

// Función para editar un ítem
function editItem(id, currentName, currentEmail) {
    // Rellenar el formulario con los datos actuales
    nameInput.value = currentName;
    emailInput.value = currentEmail;
    
    // Cambiar el texto del botón de Crear a Editar
    const submitButton = document.querySelector('button');
    submitButton.innerText = 'Editar';

    // Almacenar el ítem que estamos editando
    currentEditingItem = { _id: id, name: currentName, email: currentEmail };
}

// Función para actualizar un ítem
async function updateItem(id, updatedData) {
    const response = await fetch(`http://localhost:3000/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    });
    const updatedItem = await response.json();
    
    // Después de actualizar, la tabla se vuelve a cargar
    getItems();
}

// Obtener los ítems cuando se carga la página
window.onload = getItems;
