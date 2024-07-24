const menu = document.querySelector('#menu') as HTMLElement;
const cartBtn = document.querySelector('#cart-btn') as HTMLButtonElement;
const cartModal = document.querySelector('#cart-modal') as HTMLElement;
const cartItemContainer = document.querySelector('#cart-item') as HTMLDivElement;
const cartTotal = document.querySelector('#cart-total') as HTMLElement;
const checkoutBtn = document.querySelector('#checkout-btn') as HTMLButtonElement;
const closeModalBtn = document.querySelector('#close-modal-btn') as HTMLButtonElement;
const cartCounter = document.querySelector('#cart-count') as HTMLElement;
const addressInput = document.querySelector('#address') as HTMLInputElement;
const addressWarn = document.querySelector('#address-warn') as HTMLElement;

type Cart = {
    name: string,
    price: number,
    quantity: number
}


let cart: Cart[] = [];


// Abrir o modal do carrinho
cartBtn.addEventListener('click', (): void => {
    cartModal.style.display = 'flex';
    updateCartModal()
})

// Fechar modal quando clicar fora

cartModal.addEventListener('click', (event: Event): void => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
})

menu.addEventListener('click', (event: any) => {
    let parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name: string = parentButton.getAttribute('data-name')
        const price: number = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price);
    }
})

// Function add cart
const addToCart = (name: string, price: number) => {

    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity++;

    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
    Toastify({
        text: "Item Adicionado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ef4444",
        },

    }).showToast()
    updateCartModal();

}

// Atualiza o carrinho
const updateCartModal = () => {
    cartItemContainer.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const cartItemElement: HTMLDivElement = document.createElement('div');

        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
            
        </div>
        
        `;

        total += item.price * item.quantity


        cartItemContainer.appendChild(cartItemElement)
    })

    cartTotal.innerHTML = total.toLocaleString('pt-br', {
        style: 'currency',
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length.toString()

}


// Função para remover o elemento do carrinho

cartItemContainer.addEventListener('click', (event: any) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

const removeItemCart = (name: string) => {
    const index = cart.findIndex(item => item.name == name);

    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()

    }

}

addressInput.addEventListener('input', (event: any) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressWarn.classList.add('hidden')
        addressInput.classList.remove('border-red-500')

    }
})

checkoutBtn.addEventListener('click', () => {
    const isOpen = checkRestauranteOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops o restaurante está fechado",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },

        }).showToast()
        return
    }


    if (cart.length === 0) return

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    const cartItems = cart.map((item) => {
        return (
            `
        *Produto:* ${item.name}
        *Quantidade:* ${item.quantity}
        *Preço:* R$ ${item.price.toFixed(2)} 
        ------------
            `
        )
    }).join("")

    const message = encodeURIComponent(cartItems) // formatar msg
    const phone = "11996040937"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, '_blank')

    cart = [];
    updateCartModal()

})

// Verificar a hora 
function checkRestauranteOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22; // true or false
}

const spanItem = document.querySelector('#date-span')
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem?.classList.remove('bg-red-500')
    spanItem?.classList.add('bg-green-500')
} else {
    spanItem?.classList.remove('bg-green-500')
    spanItem?.classList.add('bg-red-500')

}
