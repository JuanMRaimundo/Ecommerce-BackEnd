const login = document.getElementById("login-form");

login.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = document.querySelector("input[name='email']").value;
	const password = document.querySelector("input[name='password']").value;

	try {
		const response = await fetch("/api/sessions/login", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.error) {
			// Mostrar mensaje de error
			console.error(data.error);
		} else {
			// Redirigir al home
			window.location.href = "/home";
		}
	} catch (error) {
		console.error("Error al enviar solicitud de login:", error);
	}
});
