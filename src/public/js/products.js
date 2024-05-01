const socket = io();
let tableProducts = document.getElementById("products");

socket.on("newProduct", (newProduct) => {
	if (newProduct && newProduct.title) {
		tableProducts.innerHTML += `
		<tr>
			<td>${newProduct.id}</td>
			<td>${newProduct.title}</td>
			<td>${newProduct.price}</td>
			<td>${newProduct.stock}</td>
			<td>
                <button class="btn btn-danger btn-delete" data-id="${newProduct.id}">Eliminar</button>
            </td>
		</tr>`;
	}
});

socket.on("deletedProduct", (productsActualiced) => {
	tableProducts.innerHTML = "";
	productsActualiced.forEach((p) => {
		tableProducts.innerHTML += `
			<tr>
				<td>${p.id}</td>
				<td>${p.title}</td>
				<td>${p.price}</td>
				<td>${p.stock}</td>
			</tr>`;
	});
});
