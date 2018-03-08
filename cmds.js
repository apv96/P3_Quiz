const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");


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
     model.getAll().forEach((quiz, id) => {
      log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
     });
      rl.prompt();
};

exports.showCmd = (rl, id) => {
      if(typeof id === "undefined"){
            errorlog(`Falta el parametro id.`);
      } else {
            try{
                  const quiz = model.getByIndex(id);
                  log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
            }catch(error){
                  errorlog(error.message);
            }
      }
      rl.prompt();
};

exports.addCmd = rl => {

      rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
            rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

                  model.add(question,answer);
                  log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta' )} ${answer}`);
                  rl.prompt();
            });
      });
};

exports.addCmd = rl => {

      rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

            rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {

                  model.add(question,answer);
                  log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta' )} ${answer}`);
                  rl.prompt();
            });
      });
};
exports.deleteCmd = (rl, id) => {
       if(typeof id === "undefined"){
            errorlog(`Falta el parametro id.`);
      } else {
            try{
                  model.deleteByIndex(id);
            }catch(error){
                  errorlog(error.message);
            }
      }
      rl.prompt();
};

exports.editCmd = (rl, id) => {
      if(typeof id === "undefined"){
            errorlog(`Falta el parametro id.`);
            rl.prompt();
      }else{
            try{
                  process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

                  rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

                  rl-question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
                        model.update(id, question, answer);
                        log(`Se ha cambiado el quiz ${colorize('id', 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer} `);
                        rl.prompt();
            });
     });
             }catch(error){
                  errorlog(error.message);
                  rl.prompt();
             }
      }
      
};

exports.testCmd = (rl, id) => {
      if(typeof id === "undefined"){    //en el caso de que no pasen 'id'
      errorlog('Falta el parametro id');
      rl.prompt();
      }else{
            try{
                  const quiz = model.getByIndex(id);

                  log(` [${colorize(id,'magenta')}]: ${quiz.question}`);

                  rl.question(colorize('Introduzca respuesta :','magenta'),answer => { 

                        if(answer.toLowerCase().trim() === quiz.answer.toLowerCase()){ 
                              log("Su respuesta es correcta.");
                              log("Correcta","green");
                        }else{
                              log("Su respuesta es incorrecta.");
                              log("Incorrecta","red");
                        }
                              rl.prompt();
                        });
            }catch(error){
                  errorlog("error desconocido");
                  rl.prompt();
            }
      }
      
};


exports.playCmd = rl => {
 let score = 0;
 let toBeResolved = []; 
 let quizzes = model.getAll();
      for (let i = 0; i< quizzes.length; i++){
            toBeResolved.push(i);
      }
 
            const playOne = () => {
                  if(toBeResolved.length === 0){
                        log('No hay mas preguntas');
                        log(` ${colorize("Su resultado es :","yellow")} ${score}`);
                        log(`Fin del examen aciertos:`);
                        log(score, 'green');
                        rl.prompt();
                  }
                  else {
                        let id = Math.floor((Math.random()*toBeResolved.length));
                        let quiz = quizzes[id];
                        rl.question(` ${colorize(quiz.question, "red")}${colorize('?' , 'red')} ` , (respuesta) => {
                        //rl.question(quiz.question, respuesta => {
                              if (respuesta.trim().toLowerCase() === quiz.answer.toLowerCase()) {
                                    score++;
                               log(` ${colorize("correcta","green")} ${score} `);
                               toBeResolved.splice(id, 1);
                               quizzes.splice(id, 1);
                               playOne(); // recursividad vuelve a empezar desde el principio para preguntar otra vez 
                              }
                              else{
                              log(`${colorize("incorrecta","red")}`);
                              log(`Fin del examen aciertos:`);
                              log(score, 'yellow');
                              rl.prompt();
                                    }                                          
                             });
                      }
            };
      playOne();
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