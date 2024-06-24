export const authRole = ([rol]) => {
	return (req, res, next) => {
		const userRole =
			req.user && req.user.rol ? req.user.rol.toLowerCase() : null;

		if (!userRole) {
			return res
				.status(403)
				.json({ error: "Acceso denegado. No se encontró el rol del usuario." });
		}

		if (rol.includes(userRole)) {
			return next();
		} else {
			return res
				.status(403)
				.json({ error: "Acceso denegado. Rol no autorizado." });
		}
	};
};
