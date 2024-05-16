export const redirectToLogin = (req, res, next) => {
	// Si la ruta es '/login' o '/registration', permitir el acceso sin redirección
	if (
		!req.session.user &&
		req.path !== "/login" &&
		req.path !== "/registration"
	) {
		return res.redirect("/login");
	}
	next();
};
