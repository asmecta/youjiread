/**
 * Created by Administrator on 2017/4/18.
 */
'use strict';
var request = require('request'),
    fs = require('fs');
fs.writeFileSync('./src/books.json',"");
var bookList = JSON.parse(fs.readFileSync('./book.json'));
var doubanDetails = [];
for (var i = 0; i < bookList.length; i++) {
    var url = "https://api.douban.com/v2/book/isbn/" + bookList[i];
    // console.log(i);
    request(url, function (error, reponse, body) {
        if (!error && reponse.statusCode == 200) {
            var details = JSON.parse(body);
            var iDetail = {};
            iDetail["title"] = details.title,
                iDetail["summary"] = details.summary,
                iDetail["author"] = details.author,
                iDetail["isbn13"] = details.isbn13,
                iDetail["subtitle"] = details.subtitle,
                iDetail["image"] = details.image;
            fs.appendFile('./src/books.json', "," + JSON.stringify(iDetail));
            console.log(iDetail)
        }
        else {
            console.log(error);
        }
    });
};