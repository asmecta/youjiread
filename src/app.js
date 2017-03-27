/**
 * Created by Administrator on 2017/3/26.
 */
'use trict'
var b =document.getElementsByClassName('search')[0];
b.addEventListener('click',function () {
    var a = document.getElementById('sBar');
    if (a.className == "hidden"){
        a.className = "";
        b.className = "search sel";
    }else {
        a.className = a.className + "hidden";
        b.className = "search default";
    }
},false);