import passport from "passport";
import localPassport from "passport-local";
import githubPassport from "passport-github2";
import { UsersManagerMongo as UsersManager } from "../dao/UsersManagerMongo.js";
import { CartManagerMongo as CartManager } from "../dao/CartManagerMongo.js";
import { generateHash, validationPassword } from "../utils.js";

const userManager = new UsersManager();
const cartManager = new CartManager();

export const initPassport = () => {
	passport.use(
		"github",
		new githubPassport.Strategy(
			{
				clientID: "Iv23liT6wosTIo3MCRXM",
				clientSecret: "baa59152e1c0743a54708b4576cb3c9f4a202df8",
				callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
			},
			async (ta, tr, profile, done) => {
				try {
					console.log(profile);
					let email = profile._json.email || profile._json.login; //pongo el login, ya que no pude conectar mi email a GitHub
					let first_name = profile._json.name;
					if (!email) {
						return done(null, false);
					}
					let user = await userManager.getUserByPopulate({ email });
					if (!user) {
						let newCart = await cartManager.createCart();
						user = await userManager.createUser({
							first_name,
							email,
							profile,
							cart: newCart._id,
						});
						user = await userManager.getUserByPopulate({ email });
					}
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
	passport.use(
		"register",
		new localPassport.Strategy(
			{
				passReqToCallback: true,
				usernameField: "email",
			},
			async (req, username, password, done) => {
				try {
					let { first_name, last_name, age } = req.body;
					if ((!first_name, !last_name, !age)) {
						return done(null, false);
					}
					let exist = await userManager.getUserBy({ email: username });
					if (exist) {
						return done(null, false);
					}

					let newCart = await cartManager.createCart();
					password = generateHash(password);

					let user = await userManager.createUser({
						first_name,
						last_name,
						email: username,
						age,
						password,
						cart: newCart._id,
					});

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.use(
		"login",
		new localPassport.Strategy(
			{
				usernameField: "email",
			},
			async (username, password, done) => {
				try {
					let user = await userManager.getUserByPopulate({ email: username });
					if (!user) {
						return done(null, false);
					}
					if (!validationPassword(password, user.password)) {
						return done(null, false);
					}
					user = { ...user };
					delete user.password;
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		return done(null, user._id);
	});
	passport.deserializeUser(async (id, done) => {
		let user = await userManager.getUserBy({ _id: id });
		return done(null, user);
	});
};
