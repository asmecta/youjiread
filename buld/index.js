/**
 * Created by Administrator on 2017/4/5.
 */
var fs = require('fs');
var request = require('request');
request('https://api.douban.com/v2/book/1220562',function (error,response,body) {
    if (!error && response.statusCode == 200){
        var details = eval("(" + body + ")");
        var books = {"title":details.title,"summary":details.summary,"author":details.author,"isbn13":details.isbn13,"subtitle":details.subtitle,"image":details.image};
        // fs.appendFile('book.json',books.toJSON);
        console.log(books.toString())
    }
});