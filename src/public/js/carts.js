const purchaseForm = document.getElementById("purchaseForm");

const comprar = async (pid) => {
	console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`);

	let respuesta = await fetch(`/api/carts/${cid}/product/${pid}`, {
		method: "post",
	});
	if (respuesta.status === 200) {
		let datos = await respuesta.json();
		console.log(datos);
		alert("Producto agregado...!!!");
	}
};

purchaseForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const cid = document.getElementById("cartId").value;
	try {
		let respuesta = await fetch(`/api/carts/${cid}/purchase`, {
			method: "POST",
		});

		if (respuesta.status === 201) {
			let datos = await respuesta.json();
			console.log(datos);
			alert(
				"Compra realizada con éxito. Se enviará el comprobante por correo electrónico."
			);
		} else {
			alert("Error al realizar la compra. Intente nuevamente.");
		}
	} catch (error) {
		console.error("Error al realizar la compra:", error);
		alert("Error al realizar la compra. Intente nuevamente más tarde.");
	}
});
