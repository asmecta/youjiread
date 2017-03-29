/**
 * Created by Administrator on 2017/3/26.
 */
'use trict'
var b =document.getElementsByClassName('search')[0];
b.addEventListener('click',function () {
    var a = document.getElementById('sBar');
    if (a.className == "hidden"){
        a.className = "container";
        b.className = "search sel";
    }else {
        a.className = "hidden";
        b.className = "search default";
    }
},false);
var xmlhttp = new XMLHttpRequest();
var books = document.getElementById("book");
xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        var book = eval ("(" + xmlhttp.responseText + ")");
        for (var i = 0; i<book.length;i++){
            var mediaHtml ='<div class="media"><div class="media-left"><a href="#"><img class="media-object" src="'+ book[i].image +'" alt="' + book[i].title + '"></a></div><div class="media-body"><span class="media-heading title" id="title">' + book[i].title + '</span><span class="subtitle">' +book[i].subtitle + '</span> <div class="author">' + book[i].author + '</div><div class="summary">' + book[i].summary + '</div></div></div>';
            books.innerHTML += mediaHtml;
        }
    }
};
xmlhttp.open("GET","./books.json?v0.0.2",true);
xmlhttp.send();

function showDetails(a) {

}