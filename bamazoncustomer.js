var mysql = require("mysql");
var inquirer = require("inquirer");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Imthebest@30",
    database: "bamazon"
});

function start() {
   
    con.connect(function (err, ) {
        con.query("SELECT Id, Product_Name, price, Stock_Quantity FROM products", function (err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("----------------------------------------------------------------------");
                console.log(`Product ID: ${results[i].Id} Product Name:  ${results[i].Product_Name}  Price: $${results[i].price} Stock: ${results[i].Stock_Quantity}`)
           
            }

            inquirer
                .prompt([
                    {
                        name: 'item',
                        message: 'What item would you like to purchase?',
                    },

                    {
                        name: 'quant',
                        message: 'How many would you like to buy?',
                    }])
                .then(function(answer){
                    var chosenItem;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Id === parseInt(answer.item)) {
                            chosenItem = results[i];
                        }

                    };
                    if (chosenItem.Stock_Quantity > parseInt(answer.quant)) {
                        var newQaunt = (chosenItem.Stock_Quantity - answer.quant);
                        var total=(answer.quant*chosenItem.price);
                        con.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    Stock_Quantity: newQaunt
                                },
                                {
                                    id: chosenItem.Id
                                }
                            ],
                            
                            function (error) {
                                if (error) throw err;
                                console.log(`Order placed successfully! Your total was $${total}`);
                                buyAgain();
                            }
                        );
                    }
                    else {
                        console.log("I'm sorry that item is not in stock!");
                        buyAgain();
                    }
                });

        });
    });
};
function buyAgain(){
    
    var secondItem = require('inquirer-confirm');
secondItem('Would you like to purchase another item?')
  .then(function confirmed() {
    start();
  }, function cancelled() {
    console.log('Thank you for shopping BAMAZON!');
  });

}

start();


