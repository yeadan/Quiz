var models = require('../models/models.js');

exports.show = function(req, res){
    	var statistics={ 
    			 n_preguntas: '-',
			 	 n_comentarios: '-',
    			 promedio_comentarios: '-',
    			 preg_sin_com: '-',
    			 preg_con_com: '-',
    			 comentarios_no_pub: '-'
    			};
		models.Quiz.count().then(function(result){
		statistics.n_preguntas=result;
		return models.Comment.count({where: ['"QuizId" IS NOT NULL']});
	}).then(function(result){
		statistics.n_comentarios=result;
		if(+statistics.n_preguntas>0) statistics.promedio_comentarios=result/statistics.n_preguntas;//si es 0 el número de preguntas no está definido
		var promise = 
        models.Quiz.findAndCountAll({
            include: [ { model: models.Comment, required: true, where: { publicado: true }}],distinct: true
        });
        return promise;
	}).then(function(result){
		statistics.preg_con_com=result.count;
		statistics.preg_sin_com=statistics.n_preguntas - result.count;
		return models.Comment.count({where: ['NOT "publicado" AND "QuizId" IS NOT NULL']});
	}).then(function(result){
		statistics.comentarios_no_pub=result;
		res.render('quizes/stadistics.ejs', {statistics: statistics, errors: []});
	}).catch(function(errors){
			var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
			for (var prop in errors) errores[i++]={message: errors[prop]};		
			res.render('quizes/stadistics.ejs', {statistics: statistics, errors: errores});
	});


};
