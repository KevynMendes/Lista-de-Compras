let shoppingList = [];

function addItem() {
    const productName = document.getElementById('product').value;

    const item = {
        name: productName,
        price: null,
        quantity: 1,
        purchased: false
    };

    shoppingList.push(item);
    displayList();
    document.getElementById('product').value = '';

    saveShoppingList(); 
}

function displayList() {
    const listContainer = document.getElementById('shoppingList');
    listContainer.innerHTML = '';

    shoppingList.forEach((item, index) => {
        const listItem = document.createElement('li');

        const productNameSpan = document.createElement('span');
        productNameSpan.textContent = item.name;
        listItem.appendChild(productNameSpan);

         // Adiciona o preço
         const priceInput = document.createElement('input');
         priceInput.type = 'number';
         priceInput.placeholder = 'R$ 0,00';
         priceInput.value = item.price ? item.price.toFixed(2) : ''; 
         priceInput.step = '0.01';
         priceInput.addEventListener('change', () => {
             item.price = parseFloat(priceInput.value) || null; 
             calculateTotal();
             saveShoppingList(); 
         });
         listItem.appendChild(priceInput);
 
         // Adiciona a quantidade
         const quantityInput = document.createElement('input');
         quantityInput.type = 'number';
         quantityInput.placeholder = 'Quantidade';
         quantityInput.value = item.quantity;
         quantityInput.addEventListener('change', () => {
             item.quantity = parseInt(quantityInput.value) || 1; // Atualiza a quantidade do item
             calculateTotal();
             saveShoppingList();
         });
         listItem.appendChild(quantityInput);
        // Checkbox para marcar como comprado
        const purchaseCheckbox = document.createElement('input');
        purchaseCheckbox.type = 'checkbox';
        purchaseCheckbox.checked = item.purchased;
        purchaseCheckbox.classList.add('purchase-checkbox');
        purchaseCheckbox.addEventListener('change', () => {
            item.purchased = purchaseCheckbox.checked;
            calculateTotal();
        });
        listItem.appendChild(purchaseCheckbox);

        // Ícone de marcação
        const checkIconLabel = document.createElement('label');
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('bi', 'bi-check-circle-fill', 'check-icon');

        // Adiciona classe para ícone verde quando o item está marcado como comprado
        if (item.purchased) {
            checkIcon.classList.add('green');
            saveShoppingList();
        }

        checkIconLabel.appendChild(checkIcon);
        checkIconLabel.addEventListener('click', () => {
            item.purchased = !item.purchased;
            purchaseCheckbox.checked = item.purchased;
            checkIcon.classList.toggle('green', item.purchased); 
            calculateTotal();
            saveShoppingList();
        });
        listItem.appendChild(checkIconLabel);
        listContainer.appendChild(listItem);

     // Botão de exclusão
     const deleteButton = document.createElement('button');
     const deleteIcon = document.createElement('i');
     deleteIcon.classList.add('bi', 'bi-trash3-fill');
     deleteButton.appendChild(deleteIcon);
     deleteButton.addEventListener('click', () => {
         shoppingList.splice(index, 1);
         displayList();
         calculateTotal();
         saveShoppingList(); 
     });

     
     listItem.appendChild(deleteButton);

     listContainer.appendChild(listItem);
 });
}

let budget = 0;

function setBudget() {
    budget = parseFloat(document.getElementById('limite').value);
}

let alertTimeout; 

function showAlert(message) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';

    alertTimeout = setTimeout(hideAlert, 5000);
}

function hideAlert() {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.style.display = 'none';

    clearTimeout(alertTimeout);
}

function calculateTotal() {
    let total = 0;

    shoppingList.forEach(item => {
        if (item.purchased && item.price) {
            total += item.price * item.quantity;
        }
    });

    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;

    if (total <= budget) {
        totalElement.classList.add('green-text'); 
        showSuccessMessage("Cálculo realizado com sucesso!");
    } else {
        totalElement.classList.remove('green-text'); 
        showAlert("Atenção: O total excede o limite de gastos!");
    }
}

function showSuccessMessage(message) {
    var mensagem = document.getElementById("mensagemcalculo");
    mensagem.textContent = message;
    mensagem.style.display = "block";

    setTimeout(function() {
        mensagem.style.display = "none";
    }, 2000);
}

function saveShoppingList() {
    // Converte a lista de compras para JSON
    const jsonShoppingList = JSON.stringify(shoppingList);
    
    // Salva a lista de compras no armazenamento local
    localStorage.setItem('shoppingList', jsonShoppingList);

    // Exibe a mensagem de sucesso
    const mensagem = document.getElementById("mensagemsave");
    mensagem.textContent = "Lista atualizada com sucesso!";
    mensagem.style.display = "block";

    setTimeout(function() {
        mensagem.style.display = "none";
    }, 500); 
}

function showInstructions() {
    var instrucoes = document.getElementById("instrucoes");
    instrucoes.style.display = "block";
}

function closeInstructions() {
    var instrucoes = document.getElementById("instrucoes");
    instrucoes.style.display = "none";
}

// Função para carregar a lista de compras do armazenamento local
function loadShoppingList() {
    const savedShoppingList = localStorage.getItem('shoppingList');
    if (savedShoppingList) {
        shoppingList = JSON.parse(savedShoppingList);
        displayList(); // Chame a função displayList() para exibir a lista carregada na interface
    }
}

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function compartilharInstagram() {
    var message = "Confira minha lista de compras no Instagram!";
    // Substitua 'SEU_USUÁRIO' pelo seu nome de usuário no Instagram
    var instagramURL = "https://www.instagram.com/direct/new/?text=" + encodeURIComponent(message);
    window.open(instagramURL, "_blank");
    closeModal();
}

function compartilharWhatsApp() {
    var message = "Confira minha lista de compras no WhatsApp!";
    var whatsappURL = "https://api.whatsapp.com/send?text=" + encodeURIComponent(message);
    window.open(whatsappURL, "_blank");
    closeModal();
}

window.onclick = function(event) {
    var instrucoes = document.getElementById("instrucoes");
    var botaoInstrucoes = document.getElementById("btnInstrucoes");
    if (event.target != instrucoes && event.target != botaoInstrucoes) {
        instrucoes.style.display = "none";
    }
}

// Carrega a lista de compras armazenada ao carregar a página
loadShoppingList();