const {models} = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");
const Sequelize = require('sequelize');

exports.helpCmd = rl => {
      log("Commandos:");
      log(" h|help - Muestra esta ayuda.");
      log(" list - Listar los quizzes existentes.");
      log(" show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
      log(" add - Añadir un nuevo quiz interactivamente.");
      log(" delete <id> - Borrar el quiz indicado.");
      log(" edit <id> - Editar el quiz indicado.");
      log(" p|play - Jugar a preguntar aleatoriamente todos los quizes.");
      log(" credits - Créditos.");
      log(" q|quit - Salir del programa.");
      rl.prompt();
};

exports.listCmd = rl => {
models.quiz.findAll()
.each(quiz => {
            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
})
.catch(error => {
      errorlog(error.message);
})
.then(() => {
      rl.prompt();
});
};

const validateId = id => {
    return new Sequelize.Promise((resolve, reject)=> {
      if(typeof id === "undefined"){
            reject(new Error(`Falta el parametro <id>.`));
      }else{
            id = parseInt(id);
            if(Number.isNaN(id)){
                  reject(new Error(`El valor del parametro <id> no es un numero.`))
            }else{
                  resolve(id);
            }
          }
      });       
};

const makeQuestion = (rl, text) => {
      return new Sequelize.Promise((resolve, reject) => {
            rl.question(colorize(text, 'red'), answer => {
                  resolve(answer.trim());
            });
      });
};

exports.showCmd = (rl, id) => {
     validateId(id)
     .then(id => models.quiz.findById(id))
     .then(quiz => {
            if(!quiz){
                  throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
     })
     .catch(error => {
      errorlog(error.message);
     })
     .then(() => {
      rl.prompt();
     });
};

exports.addCmd = rl => {
      makeQuestion(rl, ' Introduzca una pregunta: ')
      .then(q => {
            return makeQuestion(rl, ' Introduzca la respuesta ')
            .then(a => {
                  return {question: q, answer: a};
            });
      })
      .then(quiz => {
            return models.quiz.create(quiz);
      })
      .then((quiz) => {
            log(`${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>','magenta' )} ${quiz.answer}`);
      })
      .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
      })
      .catch(error => {
            errorlog(error.message);
      })
      .then(() => {
            rl.prompt();
      });

};

exports.deleteCmd = (rl, id) => {
      validateId(id)
      then(id => models.quiz.destroy({where: {i}}))
      .catch(error => {
            errorlog(error.message);
      })
      .then(() => {
            rl.prompt();
      });
};

exports.editCmd = (rl, id) => {
     validateId(id)
     .then(id => models.quiz.findById(id))
     .then(quiz => {
      if(!quiz){
            throw new Error(`No existe un quiz asociado al id=${id}.`);
      }

      process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
      return makeQuestion(rl, ' Introduzca la pregunta: ')
      .then(q => {
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
            return makeQuestion(rl, ' Introduzca la respuesta ')
            .then(a => {
                  quiz.question = q;
                  quiz.answer = a;
                  return quiz;
            });
         });
     })
      .then(quiz => {
            return quiz.save();
     })
      then(quiz => {
            log(`Se ha cambiado el quiz ${colorize('id', 'magenta')} por: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer} `);
     })
      .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
      })
      .catch(error => {
            errorlog(eror.message);
      })
      .then(() => {
            rl.prompt();
      });     
};

exports.testCmd = (rl, id) => {
      validateId(id)
      .then(id => models.quiz.findById(id))
      .then(quiz => {
            if(!quiz){
                  throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
            return makeQuestion(rl, 'Introduzca su respuesta: ')
            .then(a => {
                  if(quiz.answer.toLowerCase().trim() === a.toLowerCase()){ 
                        log("Su respuesta es correcta.");
                        log("Correcta","green");
                  }else{
                        log("Su respuesta es incorrecta.");
                        log("Incorrecta","red");
                        }
            });
      })
      .catch(error => {
            errorlog(error.message);
      })
      .then(() => {
            rl.prompt();
      });     
};


exports.playCmd = rl => {
 let score = 0;

 let toBeResolved = []; 
       
            const playOne = () => {
            return new Sequelize.Promise((resolve, reject) => {
                  if(toBeResolved.length === 0){
                        log('No hay mas preguntas');
                        log(` ${colorize("Su resultado es :","yellow")} ${score}`);
                        log(`Fin del examen aciertos:`);
                        log(score, 'green');
                        resolve();
                        return;
                  }
                        let id = Math.floor((Math.random()*toBeResolved.length));
                        let quiz = toBeResolved[id];
                        toBeResolved.splice(id, 1);

                        makeQuestion(rl, quiz.question + ' ')
                        .then(answer => {
                              if (answer.trim().toLowerCase() === quiz.answer.toLowerCase()) {
                                    score++;
                               log(` ${colorize("correcta","green")} ${score} `);
                               resolve(playOne()); 
                              }
                              else{
                              log(`${colorize("incorrecta","red")}`);
                              log(`Fin del examen aciertos:`);
                              log(score, 'yellow');
                              resolve();
                                    }
                        })                                                                          
                  })      
            }
      models.quiz.findAll()
            .then(quizzes => {
                  toBeResolved = quizzes ;           
             })
             .then(() => {
                  return playOne();
            })
            .catch(error => {
                  console.log(error);
            })
            .then(() => {
            log(score, 'magenta');
             rl.prompt();
            });
      };

exports.creditsCmd = rl => {
      log('Autores de la practica:');
      log('Alberto Pérez Vaquero','green');
      rl.prompt();
};

exports.quitCmd = rl => {
      rl.close();
      rl.prompt();
};