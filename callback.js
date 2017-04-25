/**
 * Created by Administrator on 2017/4/25.
 */
// callback.js
var fs = require('fs');
var request = require('request');
var qs = require('querystring');
/*读取文件中的 IP 列表，调用 fs.readFile 读取文件内容，再通过 JSON.parse 来解析 JSON 数据：
 */
function readIP(path, callback) {
    fs.readFile(path, function (err, data) {
        if (err) {
            callback(err)
        } else {
            try {
                data = JSON.parse(data);
                callback(null, data)
            } catch (error) {
                callback(error)
            }
        }
    })
}
/*
 接着就是使用 IP 来获取geo，我们使用 request 来请求一个开放的 geo 服务：
 */
function ip2geo(ip, callback) {
    var url = 'http://www.telize.com/geoip/' + ip;
    request({
        url: url,
        json: true
    }, function (err, resp, body) {
        callback(err, body)
    })
}
/*
 使用 geo 数据来获取 weather：
 */
function geo2weather(lat, lon, callback) {
    var params = {
        lat: lat,
        lon: lon,
        APPID: '9bf4d2b07c7ddeb780c5b32e636c679d'
    };
    var url = 'http://api.openweathermap.org/data/2.5/weather?' + qs.stringify(params);
    request({
        url: url,
        json: true,
    }, function (err, resp, body) {
        callback(err, body)
    })
}
/*
 现在我们已经获取 geo、获取 weather 的接口，接下来我们还有稍微复杂的问题要处理，因为 ip 有多个，所以我们需要并行地去读取 geo 已经并行地读取 weather 数据：
 */
function ips2geos(ips, callback) {
    var geos = [];
    var ip;
    var remain = ips.length;
    for (var i = 0; i < ips.length; i++) {
        ip = ips[i];
        (function (ip) {
            ip2geo(ip, function (err, geo) {
                if (err) {
                    callback(err)
                } else {
                    geo.ip = ip;
                    geos.push(geo);
                    remain--
                }
                if (remain == 0) {
                    callback(null, geos)
                }
            })
        })(ip)
    }
}
function geos2weathers(geos, callback) {
    var weathers = [];
    var geo;
    var remain = geos.length;
    for (var i = 0; i < geos.length; i++) {
        geo = geos[i];
        (function (geo) {
            geo2weather(geo.latitude, geo.longitude, function (err, weather) {
                if (err) {
                    callback(err)
                } else {
                    weather.geo = geo;
                    weathers.push(weather);
                    remain--
                }
                if (remain == 0) {
                    callback(null, weathers)
                }
            })
        })(geo)
    }
}
/*
 ips2geos 和 geos2weathers 都使用了一种比较原始的方法，remain 来计算等待返回的个数，remain 为 0 表示并行请求结束，将处理结果装进一个数组返回。
 最后就是将结果写入到 weather.json 文件中：
 */
function writeWeather(weathers, callback) {
    var output = [];
    var weather;
    for (var i = 0; i < weathers.length; i++) {
        weather = weathers[i];
        output.push({
            ip: weather.geo.ip,
            weather: weather.weather[0].main,
            region: weather.geo.region
        })
    }
    fs.writeFile('./weather.json', JSON.stringify(output, null, '  '), callback)
}
/*
 组合上面这些函数，我们就可以实现我们的目标：
 */
function handlerError(err) {
    console.log('error: ' + err)
}
function ReadIPCallback(err, ips) {//ips = data
    if (err) {
        handlerError(err)
    } else {
        ips2geos(ips, ips2geosCallback)
    }
}
function ips2geosCallback(err, geos) {
    if (err) {
        handlerError(err)
    } else {
        geos2weathers(geos, geos2weathersCallback)
    }
}
function geos2weathersCallback(err, weathers) {
    if (err) {
        handlerError(err)
    } else {
        writeWeather(weathers, writeWeatherCallback)
    }
}
function writeWeatherCallback(err) {
    if (err) {
        handlerError(err)
    } else {
        console.log('success!')
    }
}
readIP('./ip.json', ReadIPCallback);