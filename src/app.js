/**
 * version:v0.0.4
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
            var mediaHtml ='<div class="media" id="'+ book[i].isbn13 + '" onclick="addJs(this.id)"><div class="media-left"><a><img class="media-object" src="'+ book[i].image +'" alt="' + book[i].title + '"></a></div><div class="media-body"><span class="media-heading title">' + book[i].title + '</span><span class="subtitle">' +book[i].subtitle + '</span> <div class="author">' + book[i].author + '</div><div class="summary">' + book[i].summary.replace("\n","<br>") + '</div></div></div>';
            books.innerHTML += mediaHtml;
        }
    }
};
xmlhttp.open("GET","./books.json",true);
xmlhttp.send();

function showMore(a,b) {
    a.style.display="none";
    document.getElementById(b).style.height = "inherit";
}
function getDetails(result) {
    for (var i in result){
        if(selector(i) && (typeof result[i] == Object || Array)) {
            selector(i).innerHTML = result[i];
        }else if(selector(i)){
            selector(i).innerHTML = result[i].replace("\n","<br>");
        }
    }
    selector("img").alt=result.title;
    selector("img").src = result.images.large;
    document.getElementById("bookDetail").style.display="block";
    selector("dburl").href=result.alt;
    document.getElementsByTagName("title")[0].innerHTML=result.title;
}
function showDatils(data) {
    console.log(data);
}
function selector(id) {
    var x =document.getElementById(id);
    return x;
}
function addJs(id) {
        var JSONP = document.createElement("script");
        JSONP.type = "text/javascript";
        JSONP.id = "id";
        JSONP.src = "https://api.douban.com/v2/book/isbn/" + id + "?callback=getDetails";
        document.getElementsByTagName("head")[0].appendChild(JSONP);
        JSONP.onload  = function () {
            if (this.readyState || !this.readyState === "loaded" || !this.readyState === "complete" ) {
                alert('暂无详细信息');
                script.onload = script.onreadystatechange = null;
            }
        }
}
function hiddenDetails() {
    document.getElementsByTagName("title")[0].innerHTML="友寄读书";
    var child = document.getElementById("id");
    document.getElementsByTagName("head")[0].removeChild(child);
    document.getElementById("bookDetail").style.display="none";
}