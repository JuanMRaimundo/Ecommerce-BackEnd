const login = document.getElementById("btnSubmit");

login.addEventListener("submit", async (e) => {
	e.preventDefault();

	let body = {
		email: document.querySelector("input[name='email']").value.trim(),
		password: document.querySelector("input[name='password']").value.trim(),
	};

	try {
		const response = await fetch("/api/sessions/login", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		if (data.error) {
			// Mostrar mensaje de error
			console.error(data.error);
		} else {
			console.log(data.payload);
			// Redirigir al home
			window.location.href = "/home";
		}
	} catch (error) {
		console.error("Error al enviar solicitud de login:", error);
	}
});
