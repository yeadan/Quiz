
//GET /login -- Formulario de login
exports.new = function(req,res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};

//POST /login -- Crear la sesion
exports.create = function(req,res) {

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) { //Si hay error retornamos mensaje de error de sesión
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}

		req.session.user = {id: user.id, username: user.username};
		res.redirect(req.session.redir.toString()); // redirección a path anterior

		});	
};


//DELETE /logout
exports.destroy =  function(req,res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); //redirect a path anterior al login
};