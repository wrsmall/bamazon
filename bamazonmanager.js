require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys=require("./keys.js");
var con =mysql.createConnection(keys.password);


function routes() {
    con.connect(function (err, ) {
        con.query("SELECT Id, Product_Name, price, Stock_Quantity FROM products", function (err, results) {
            if (err) throw err;

            inquirer
                .prompt(
                    {
                        name: 'Duty',
                        type: 'list',
                        message: "What would you like to do?",
                        choices: ["See Inventory", "Check Low Inventory", "Add Inventory", "Add New Item", "Exit"]
                    })
                .then(function (answer) {
                    switch (answer.Duty) {
                        case "See Inventory":
                            Inventory(results);
                            break;
                        case "Check Low Inventory":
                            lowInventory(results);
                            break;
                        case "Add Inventory":
                            addInventory();
                            break;
                        case "Add New Item":
                            newItem();
                            break;
                        case "Exit":
                            console.log("Thank you for using BAMAZON!")
                            con.end();
                            break;
                    }
                });
        })
    })
};
function Inventory() {
    con.query("SELECT Id, Product_Name, price, Stock_Quantity FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("----------------------------------------------------------------------");
            console.log(`Product ID: ${results[i].Id} Product Name:  ${results[i].Product_Name}  Price: $${results[i].price} Stock: ${results[i].Stock_Quantity}`)

        };
    });
}

function lowInventory() {
    inquirer
        .prompt([
            {
                name: "invent",
                message: 'You want to see items below what Quantity'
            }])


        .then(function (answer) {
            var inv = parseInt(answer.invent);
            con.query("SELECT * FROM products where Stock_Quantity<?", [inv], function (err, results) {
                for (var i = 0; i < results.length; i++) {
                    console.log(`Product ID: ${results[i].Id} Product Name:  ${results[i].Product_Name}  Price: $${results[i].Price} Stock: ${results[i].Stock_Quantity}`)
                }
            });
            routes();
        });

};



function newItem() {
    inquirer
        .prompt([
            {
                name: "newitem",
                type: "input",
                message: "What new item are you trying to add?"
            },
            {
                name: "newprice",
                type: "input",
                message: "How much is your new item?"
            },
            {
                name: "newcat",
                type: "input",
                message: "What category is this item in"
            },
            {
                name: "stock",
                type: "input",
                message: " How many of this item do you want to add"
            }])
        .then(function (answer) {
            con.query(
                "INSERT INTO products SET ?",
                {
                    Product_Name: answer.newitem,
                    price: answer.newprice,
                    Department_Name: answer.newcat,
                    Stock_Quantity: answer.stock,
                },
            )
            Inventory();
            routes();
        })


}
function addInventory() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "To which item would you like to add inventory?"
            },
            {
                name: "quanity",
                type: "input",
                message: "How much inventory would you like to add?"
            }])
        .then(function (answer) {
            con.query("SELECT * FROM products", function (results2) {

                var chosenItem;
                for (var i = 0; i < results2.length; i++) {
                    if (results2[i].Product_Name === parseInt(answer.item)) {
                        chosenItem = results[i];
                    }
                }

                // Adds new stock  to existing stock.
                var updatedStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.quanity);

                console.log(`${updatedStock} UNITS ADDED!!`)

                con.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updatedStock
                }, {
                    item_id: answer.item
                }],

                );
                Inventory();
                routes();
            });





        });
};







routes();