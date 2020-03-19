const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv/config');
const db = require('quick.db');

var getStates = setInterval(async () => {
    let response;
    try{
        response = await axios.get("https://www.mohfw.gov.in/");
        if (response.status !== 200){
            console.log("Error", response.status);

        }
    }
    catch(err){
        return null
    }

const result = [];
const html = cheerio.load(response.data);
const statesTable = html("table.table-striped");
const statesTablecell = statesTable
.children("tbody")
.children("tr")
.children("td");

for (let i=0; i<= statesTablecell.length - 6; i+=1){
    const cell = statesTablecell[i];

    if(i%6=== 1){
        let States = cell.children[0].data;
        States = States.trim()
            result.push({States: States.trim()}
        )
        
        
    }
    if(i%6=== 2){
        let IndianNationalCases = cell.children[0].data || "";
        result[result.length-1].IndianNationalCases = parseInt(
            IndianNationalCases.trim() || "0",
            10
        )
        
        
    }
    if(i%6=== 3){
        let ForeignNationalCases = cell.children[0].data || "";
        result[result.length-1].ForeignNationalCases = parseInt(
            ForeignNationalCases.trim() || "0",
            10
        )
        
        
    }
    if(i%6=== 4){
        let Cured = cell.children[0].data || "";
        result[result.length-1].Cured = parseInt(
            Cured.trim() || "0",
            10
        )
        
        
    }
    if(i%6=== 5){
        let Deaths = cell.children[0].data || "";
        result[result.length-1].Deaths = parseInt(
            Deaths.trim() || "0",
            10
        )
    }
 //if(index ===0){
   //  const ths = html(element).find("th");
     //html(ths).each((i,element) => {
       //     tableheaders.push(
         //       html(element)
           //     .text()
             //   .toLowerCase()
            //);}) }

//const tds = html(element).find("td");
//const tableRow = {};
//html(tds).each((i,element) => {
  //  tableRow[tableheaders[i]] = html(element).text();});
//result.push(tableRow);});
}

console.log(result);
db.set("covid", result, () =>{
console.log("Updated");
});
}, 150000);

router.get('/', async function(req,res) {
    let states = await db.fetch("covid");
    res.send(states);
});

module.exports = router;