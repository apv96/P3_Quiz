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
                              biglog("Correcta","green");
                        }else{
                              log("Su respuesta es incorrecta.");
                              biglog("Incorrecta","red");
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
 let toBeResolved = []; // ids de todas las preguntas que existen
 //voy a meter todas las preguntas existentes
 let quizzes = model.getAll();
      for (let i = 0; i< quizzes.length; i++){
            toBeResolved.push(i);
      }
 
            const playOne = () => {
                  if(toBeResolved.length === 0){
                        log('No hay mas preguntas');
                        log(` ${colorize("El resultado obtenido es:","magenta")} ${score}`);
                        fin();
                        rl.prompt();
                  }
                  else {
                        let quiz = quizzes[Math.floor((Math.random()*toBeResolved.length))];
                        rl.question(` ${colorize(quiz.question, "red")}${colorize('?' , 'red')} ` , (respuesta) => {

                              if (respuesta.trim().toLowerCase() === quiz.answer.toLowerCase()) {
                                    score++;
                               log(` ${colorize("correcta","magenta")} ${score} `);
                               toBeResolved.splice(Math.floor((Math.random()*toBeResolved.length)), 1);
                               quizzes.splice(Math.floor((Math.random()*toBeResolved.length)), 1);
                               playOne();
                              }
                              else{
                              biglog(`${colorize("incorrecta","magenta")}`);
                              fin();
                              rl.prompt();
                                    }
                                          
                             });
                      }
      };
      const  fin =() => {
            log(`Fin del examen aciertos:`);
            biglog(score, 'magenta');
      }
      playOne();
      };
exports.creditsCmd = rl => {
      log('Autores de la practica:');
      log('Alberto Pérez Vaquero','green');
      rl.prompt();
};

exports.quitCmd = rl => {
      rl.close();
};