/**
 * Created by Administrator on 2017/4/18.
 */
'use strict';
var request = require('request'),
    fs = require('fs');
fs.writeFileSync('./src/books.json', "");
var bookList = JSON.parse(fs.readFileSync('./isbn.json'));
var doubanDetails = [];
var item = bookList.length;
for (let i = 0; i < bookList.length; i++) {
    var url = "https://api.douban.com/v2/book/isbn/" + bookList[i];
    // var url="http://localhost:3000/book?isbn=" + bookList[i];
    request(url, function (error, reponse, body) {
        if (!error && reponse.statusCode == 200) {
            var details = JSON.parse(body);
            var iDetail = {};
            if (details.isbn13) {
                iDetail["title"] = details.title;
                iDetail["summary"] = details.summary;
                iDetail["author"] = details.author;
                iDetail["isbn13"] = details.isbn13;
                iDetail["subtitle"] = details.subtitle;
                iDetail["image"] = details.image;
                // doubanDetails.push(iDetail);
                doubanDetails[i] = iDetail;
                item--;
            } else {
                console.log(error);
            }
            if (item == 0) {
                console.log(JSON.stringify(doubanDetails));
                fs.appendFile('./src/books.json', JSON.stringify(doubanDetails), function (err) {
                    if (err) {
                        console.log("WriteError：" + err);
                    }
                });
            }
        }
        else {
            console.log(error);
            item--;
        }
    });
}