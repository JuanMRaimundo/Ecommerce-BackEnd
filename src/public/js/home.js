const addToCart = async (pid, cid) => {
	/*  console.log(`Código del producto ${pid}`);
	let cid = "6637b5e157aa5f255e943b93"; */
	/* let inputCart = document.getElementById("btn-addProduct");
	let cid = inputCart.value;
	console.log("este es el cid del home" + cid);
	const url = `/api/carts/${cid}/products/${pid}`;

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
			Swal.fire("Producto agregado al carrito!");
			console.log(cid + "y el " + pid);
		} else {
			throw new Error("Error al agregar el producto al carrito");
		}
	} catch (error) {
		console.error("Error al realizar la solicitud:", error.message);
	} */

	const url = `/api/carts/${cid}/products/${pid}`;

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
			Swal.fire("Producto agregado al carrito!");
			console.log(cid + " y el " + pid);
		} else {
			throw new Error("Error al agregar el producto al carrito");
		}
	} catch (error) {
		console.error("Error al realizar la solicitud:", error.message);
	}

	/* let inputCart = document.getElementById("btn-addProduct");
	let cid = inputCart.value;
	console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`);

	let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
		method: "post",
	});
	if (response.status === 200) {
		let data = await response.json();
		console.log(data);
		alert("Producto agregado...!!!");
	} */
};
