const socket = io();
const productsList = document.getElementById ("productsList");
const addForm = document.getElementById ("addForm");
const deleteForm = document.getElementById ("deleteForm");

addForm.addEventListener ("submit", async (e) =>{
    e.preventDefault ();
    const title = document.getElementById ("title").value;
    const price = document.getElementById ("price").value;
    const description = document.getElementById ("description").value;

    await fetch ("/realtimeproducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify ({title, price, description})
    });
    addForm.reset ();
    Toastify({
        text: `Se ha añadido el producto ${title}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
})

deleteForm.addEventListener ("submit", async (e) => {
    e.preventDefault ();
    const id = document.getElementById ("id").value;
    await fetch ("/realtimeproducts", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify ({id})
    });
    deleteForm.reset ();
    Toastify({
        text: `Se ha eliminado el producto con el ID ${id}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, crimson, red)",
        },
      }).showToast();    

})



socket.on("products", (data) => {
    productsList.innerHTML = "";
    let currentRow;
    data.forEach((product, index) => {
        if (index % 4 === 0) {
            currentRow = document.createElement("div");
            currentRow.classList.add("row", "justify-content-center", "mb-3");
            productsList.appendChild(currentRow);
        }

        const column = document.createElement("div");
        column.classList.add("col-md-3");

        const card = document.createElement("div");
        card.classList.add("card");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "p-3", "text-center", "tarjeta");

        cardBody.innerHTML = `
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">ID: ${product.id}</p>
            <p class="card-text">${product.description}</p>
            <p class="card-text">$${product.price}</p>
        `;

        card.appendChild(cardBody);
        column.appendChild(card);
        currentRow.appendChild(column);
    });
});


