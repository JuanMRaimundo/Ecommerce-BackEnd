// export const auth = (req, res, next) => {
//	if (!req.session.user) {
//		res.setHeader("Content-Type", "application/json");
//		 return res.status(401).json({ error: `No existen usuaruios autenticados` }); */
//	return res.redirect("/login");
//}

///	next();
//};
export const auth = (permissions = []) => {
	// auth(["admin", "user"])  o  auth(["admin"])
	return (req, res, next) => {
		permissions = permissions.map((p) => p.toLowerCase());

		if (permissions.includes("public")) {
			return next();
		}

		if (!req.user?.rol) {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(401)
				.json({ error: `No hay usuarios autenticados, o problema con el rol` });
		}

		if (!permissions.includes(req.user.rol.toLowerCase())) {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(403)
				.json({ error: `Acceso denegado por rol insuficiente` });
		}

		return next();
	};
};
