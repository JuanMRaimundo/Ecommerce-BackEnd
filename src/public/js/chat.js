document.addEventListener("DOMContentLoaded", () => {
	Swal.fire({
		title: "Debe identificarse",
		input: "text",
		text: "Ingrese su nombre",
		inputValidator: (value) => {
			return !value && "¡Debe ingresar un nombre!";
		},
		allowOutsideClick: false,
	}).then((datos) => {
		console.log(datos);
		let email = datos.value;
		let inputMessage = document.getElementById("message");
		let divMessages = document.getElementById("messages");
		inputMessage.focus();

		socket.emit("id", email);

		socket.on("newUser", (email) => {
			Swal.fire({
				text: `${email} se ha conectado!`,
				toast: true,
				position: "top-right",
			});
		});

		socket.on("prevMessages", (messages) => {
			messages.forEach((e) => {
				divMessages.innerHTML += `<span class="message" ><strong>${e.email} </strong> dice: <i>${e.message}</i></span><br>`;
				divMessages.scrollTop = divMessages.scrollHeight;
			});
		});
		socket.on("userOff", (email) => {
			divMessages.innerHTML += `<span class="messageOff" ><strong>${email} </strong> ha abandonado el chat...</span><br>`;
			divMessages.scrollTop = divMessages.scrollHeight;
		});

		inputMessage.addEventListener("keyup", (e) => {
			e.preventDefault();

			if (e.code === "Enter" && e.target.value.trim().length > 0) {
				socket.emit("message", email, e.target.value.trim());
				e.target.value = "";
				e.target.focus();
			}
		});
		socket.on("newMessage", (email, message) => {
			divMessages.innerHTML += `<span class="message"><strong>${email} </strong> dice: <i>${message}</i></span><br>`;
			divMessages.scrollTop = divMessages.scrollHeight;
		});
	});
});
