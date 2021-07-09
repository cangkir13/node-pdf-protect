const express = require('express');
const app = express();
const ejs = require('ejs');
const pdfConvert = require('html-pdf');
const pdfProtect = require('hummus-recipe');
const fs = require('fs');
const path = require('path');
const view = path.join(__dirname, './view/')

app.set('view engine', 'ejs');

app.get('/', function(req, res) {

    // sample with JSON FILE
    let sample = fs.readFileSync('data.json');
    let parse = JSON.parse(sample);
    // data passing to view
    let data = {
        data : parse,
        tag : 'sample protect'
    }

    // render ejs
    ejs.renderFile(view+'index.ejs', data, {} , (err, str) => {
        if(err) {
            console.log(err);
            return res.send('false render');
        }
        // tmp
        let before = 'output/before.pdf';
        pdfConvert.create(str, {format: 'Letter'}).toFile(before, function(err, response) {
            if(err) return console.log('error convert pdf', err)
            let after = 'output/after.pdf';
            let encryptfile = new pdfProtect(before, after)
            encryptfile.encrypt({
                userPassword: 'abc',
                ownerPassword: '1234',
                userProtectionFlag: 4
            }).endPDF();
        })

    })

    res.send("success render")
})

app.listen(3000)
console.log('Server is listening on port 3000');