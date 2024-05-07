//pasar lógica de las rutas aqui
//agregar el cart y chat
//fetch a la ruta de agregar de a un producto
// Define la URL a la que deseas enviar la solicitud (cambia esto por tu URL real)
let cid = "6637b5e157aa5f255e943b93";
const url = `http://localhost:8080/api/carts/:${cid}/products/:${pid}`;

// Define los datos que deseas enviar en el cuerpo de la solicitud (si es necesario)
const data = {
	productId: pid,
	// Otros datos del producto, si es necesario
};

// Configura la solicitud
const options = {
	method: "POST", // Método HTTP POST para agregar un producto al carrito
	headers: {
		"Content-Type": "application/json", // Especifica el tipo de contenido del cuerpo de la solicitud
	},
	body: JSON.stringify(data), // Convierte el objeto de datos a formato JSON para enviarlo en el cuerpo de la solicitud
};

try {
	// Envía la solicitud utilizando fetch
	const response = await fetch(url, options);

	// Verifica si la solicitud fue exitosa (código de estado 200)
	if (response.ok) {
		console.log("Producto agregado al carrito exitosamente");
		$("#addToCartModal").modal("show");
		// Puedes realizar otras acciones aquí, como actualizar la UI para reflejar el cambio
	} else {
		// Si la solicitud no fue exitosa, lanza un error
		throw new Error("Error al agregar el producto al carrito");
	}
} catch (error) {
	// Captura cualquier error que ocurra durante la solicitud
	console.error("Error al realizar la solicitud:", error.message);
	// Puedes manejar el error de manera adecuada aquí, como mostrar un mensaje de error al usuario
}
