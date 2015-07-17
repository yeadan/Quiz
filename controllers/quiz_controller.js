var models = require('../models/models.js');

// AutoLoad - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizID=' + quizId));	}
		}).catch(function(error) { next(error);});
};
//GET /quizes
exports.index = function(req,res) {
	//poner search
	if(req.query.search) {
		var busca = '%' + (req.query.search).replace(/ /g,'%') + '%';
				console.log(busca);
    	models.Quiz.findAll({where:["pregunta like ?", busca],order:'pregunta ASC'}).then(function(quizes){
      	res.render('quizes/index', {quizes: quizes});
    }).catch(function(error) { next(error);});
    } else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}).catch(function(error) { next(error);})}
};

//GET /quizes/:id
exports.show = function(req,res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET quizes/:id/answer
exports.answer=function(req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado='Correcto';
			//res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
	} 
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create/
exports.create = function(req,res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.
	validate()
	.then(
		function(err){
			if (err) {
				res.render("quizes/new", {quiz: quiz, errors: err.errors});
			} else {
				//guarda en DB los campso pregunta y respuesta de quiz
				quiz.
				save({fields: ["pregunta", "respuesta"]}).
				then(function(){res.redirect('/quizes');}) //Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);	
};
