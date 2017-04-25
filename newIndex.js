/**
 * Created by Administrator on 2017/4/25.
 */
// 'use strict';

var request = require('request'),
    fs = require('fs');

//读取文件中的书籍ID
function readFile(path, callback) {
    fs.readFile(path, function (err, data) {
        if (err) {
            callback(err);
        } else {
            try {
                data = JSON.parse(data);
                callback(null, data);
            } catch (error) {
                callback(error);
            }
        }
    })
}
//通过书籍ID，获取书籍详情
function id2details(id, callback) {
    var url = 'https://api.douban.com/v2/book/isbn/' + id;
    request(url, function (err, res, body) {
        callback(err, body);
    })
}

function details2books(details, callback) {
    var doubanDetails = [];
    var detail = {};
    var remain = details.length;
    for (var i = 0; i < remain; i++) {
        // debugger;
        detail = details[i];
        (function (detail) {
            id2details(detail, function (err, doubanDetail) {
                if (err) {
                    callback(err);
                } else {
                    doubanDetail.detail =detail;
                    doubanDetails.push(doubanDetail);
                    remain--;
                }
                if (remain == 0) {
                    callback(null, doubanDetails);
                }
            })
        })(detail)
    }
}

function writeDetail(doubandetails, callback) {
    var output = [];
    var doubandetail;
    for (var i = 0; i < doubandetails.length; i++) {
        doubandetail = doubandetails[i];
        debugger;
        console.log(doubandetail);
        output.push({
            title: doubandetails.title,
            summary: doubandetails.summary,
            author: doubandetails.author,
            isbn13: doubandetails.isbn13,
            subtitle: doubandetails.subtitle,
            image: doubandetails.image
        })
    }
    fs.writeFile('./src/books.json',JSON.stringify(output,null,'  '),callback)
}

function handlerError(err) {
    console.log('error:' + err);
}
function readCallback(err,ids) {
    if (err){
        handlerError(err);
    }else{
        details2books(ids,details2bookCallback);
    }
}
function details2bookCallback(err,doubanDetails) {
    if(err){
        handlerError(err);
    }else {
        writeDetail(doubanDetails,writeDetailsCallback)
    }
}
function writeDetailsCallback(err) {
    if(err){
        handlerError(err);
    }else {
        console.log('success!')
    }
}
readFile('./book.json',readCallback);