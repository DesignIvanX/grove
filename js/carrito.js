document.addEventListener("DOMContentLoaded", () => {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
    const contenedorTotal = document.querySelector("#total");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");
    const contenedorPaypal = document.querySelector("#paypal-button-container");

    // Función para formatear los precios
    function formatearPrecio(precio) {
        return precio.toLocaleString('es-PY'); // Formato para Paraguay
    }

    function cargarProductosCarrito() {
        if (productosEnCarrito.length > 0) {
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.remove("disabled");
            contenedorCarritoAcciones.classList.remove("disabled");
            contenedorCarritoComprado.classList.add("disabled");

            contenedorCarritoProductos.innerHTML = "";

            productosEnCarrito.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="carrito-producto-titulo">
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p>Gs. ${formatearPrecio(producto.precio)}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>Gs. ${formatearPrecio(producto.precio * producto.cantidad)}</p>
                    </div>
                    <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                `;
                contenedorCarritoProductos.append(div);
            });

            actualizarBotonesEliminar();
            actualizarTotal();
        } else {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");
        }
    }

    function actualizarBotonesEliminar() {
        document.querySelectorAll(".carrito-producto-eliminar").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const idBoton = e.currentTarget.id;
                const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
                productosEnCarrito.splice(index, 1);
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
                Toastify({
                    text: "Producto eliminado",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #4b33a8, #785ce9)",
                        borderRadius: "2rem",
                        fontSize: ".75rem"
                    },
                }).showToast();
            });
        });
    }

    botonVaciar.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'question',
            html: `Se van a borrar ${productosEnCarrito.reduce((acc, p) => acc + p.cantidad, 0)} productos.`,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito = [];
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
            }
        });
    });

    function actualizarTotal() {
        const totalCalculado = productosEnCarrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        contenedorTotal.innerText = `Gs. ${formatearPrecio(totalCalculado)}`;
        return totalCalculado;
    }

    botonComprar.addEventListener("click", () => {
        if (!productosEnCarrito.length) {
            Swal.fire("Tu carrito está vacío", "Agrega productos antes de comprar.", "info");
            return;
        }

        let mensaje = "¡Hola! Quiero comprar estos productos:\n\n";
        productosEnCarrito.forEach(producto => {
            mensaje += `🛍️ ${producto.titulo} - Cantidad: ${producto.cantidad} - Precio: ${formatearPrecio(producto.precio)} Gs\n`;
        });
        const total = actualizarTotal();
        mensaje += `\n💰 Total: ${formatearPrecio(total)} Gs`;

        const numero = "595992233418";
        const enlace = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
        window.open(enlace, "_blank");

        productosEnCarrito = [];
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        mostrarCarritoComprado();
    });

    function mostrarCarritoComprado() {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
        contenedorPaypal.classList.add("disabled");
    }

    cargarProductosCarrito();
});

