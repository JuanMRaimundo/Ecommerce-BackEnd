console.log("hola");
const addToCart = async (pid) => {
	console.log(`Código del producto ${pid}`);
	let cid = "6637b5e157aa5f255e943b93";
	const url = `/api/carts/:${cid}/products/:${pid}`;

	const data = {
		productId: pid,
	};

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	let response;
	try {
		response = await fetch(url, options);

		if (response.ok) {
			console.log("Producto agregado al carrito exitosamente");
			$("#addToCartModal").modal("show");
		} else {
			throw new Error("Error al agregar el producto al carrito");
		}
	} catch (error) {
		console.error("Error al realizar la solicitud:", error.message);
	}
};
