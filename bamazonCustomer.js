//Connecting mysql/inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');

//linking to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    create();
  });


  var create = function () {
    //display data for user 
    connection.query("SELECT * FROM products", function (err, res) {

        for (var i = 0; i < res.length; i++) {

            var Results = [
                
                "ID:" + res[i].item_id,
                "Product:" + res[i].product_name,
                "Price:" + res[i].price,
                
            ].join("-");

            
            console.log(Results); 
            
        }
        //ask user if they want to buy a product listed
        prompt(res);
    })
}

var prompt = function (res) {
    //take user input for question 1
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "What Would You Like To Buy?"
    }])

.then(function (answer) {
    var correct = false;
    
        //if input matches item listed as next question
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How Many Would You Like to Buy?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;

                        } else {
                            return false;
                        }
                    }
                    //If the stockquanitity is not less then zero then minus amount ordered from the total 
                })
                
                .then(function (answer) {
                    if ((res[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + 
                        (res[id].stock_quantity - answer.quant) + 
                        "'WHERE product_name='" + product + "'", function () {

                            create();
                            var totalCost = answer.quant * res[id].price;

                            var cResults = [
                                
                                "You Bought a Product",
                                "TOTAL COST: $ " + totalCost,
                            

                            ].join("\n\n");

                            
                            console.log(cResults); 

                            
                        })
                        //if zero quanitity
                    } else {
                        console.log("Insufficient quantity!" + "\n");
                        prompt(res);
                    }

                })
            }
        }
        //If input does not match
        if (i == res.length && correct == false) {
            console.log("Wrong Choice!" + "\n");
            prompt(res);
        }
    })
}




