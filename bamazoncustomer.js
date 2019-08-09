var mysql = require("mysql");
var inquirer = require("inquirer");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Imthebest@30",
    database: "bamazon"
});
con.connect(function (err, ) {
    con.query("SELECT Id, Product_Name, price, Stock_Quantity FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("--------------------------------------------------------");
            console.log(`Product ID: ${results[i].Id} Product Name:  ${results[i].Product_Name}  Price: $${results[i].price} Stock: ${results[i].Stock_Quantity}`)
        }

    });
});   
    
