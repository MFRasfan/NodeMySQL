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
})