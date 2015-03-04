define(['zepto'], function($){

    // api地址
    var API_URL = 'http://114.215.141.58:8088/metro/metro/';
    // 错误code与描述map表
    var errorMap = {
        '-1': '提交参数缺失或参数名不正确',
        '-12': '未开通城市ID',
        '-100': '接口后台程序异常'
    };
    return {
        get: function(func, params, callback){
            $.ajax({
                url: API_URL  + func + '.htm',
                type: 'GET',
                dataType:'json',
                data: params,
                success: function(data){
                    if(data.result && data.result < 0){
                        var errorMsg = errorMap[data.result.toString()];
                        if(errorMsg){
                            data.errorMsg = errorMsg;
                        } else{
                            data.errorMsg = '发生异常';
                        }
                    }
                    callback(data);
                }
            });
        },

        post: function(module, func, params, callback){
            if(module) module += '/';
            $.ajax({
                url: API_URL + module + func + '.htm',
                type: 'POST',
                data: params,
                success: function(data){
                    if(data.result && data.result < 0){
                        var errorMsg = errorMap[data.result.toString()];
                        if(errorMsg){
                            data.errorMsg = errorMsg;
                        } else{
                            data.errorMsg = '发生异常';
                        }
                    }
                    callback(data);
                }
            });
        },
        //获取查询名称
        getParameterByName: function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(window.location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        getLocalTime:function(time){
            var date=new Date(time);
            return fixZero(date.getHours(),2)+":"+fixZero(date.getMinutes(),2)+":"+fixZero(date.getSeconds(),2);
        }
    };
    function fixZero(num,length){
        var str=""+num;
        var len=str.length;
        var s="";
        for(var i=length;i-->len;){
            s+="0";
        }
        return s+str;
    }

});