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
