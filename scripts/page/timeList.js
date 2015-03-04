require(['../config'], function(){
    require(['zepto', 'net'], function($, net){
        var activate = ('createTouch' in document) ? 'touchend' : 'click';
        var touchstart = ('createTouch' in document) ? 'touchstart' : 'click';
        var stationId = net.getParameterByName('stationId');
        var isUpward = net.getParameterByName('isUpward');
        var lineName = net.getParameterByName('lineName');
        $("#header").load("header.html", function() {
            $("#teamName").text(lineName);
        });
        var PassLines = $("#PassLines");
        var downStartTime,downEndtime,upStartTime,upEndTime,lineStartTime,lineEndTime;
        var trainIdList = '',trainId = '',trainIds='';
        var lineIdList = '';
        var lineId;
        var lineListUp = $("#lineListUp");
        var lineListDown = $("#lineListDown");
        var stationList = $("#stationList");
        /*获取本站所有线路信息*/
        net.get('getPassLines', {data: '{stationId:"'+ stationId  + '"}'}, function(data){
            $.each(data.data, function (index, comment) {
                var PassLinesHtml = '<ul>';
                var length = comment.length;
                for(i=0; i<length; i++){
                    PassLinesHtml = PassLinesHtml +
                        '<li><a>' + comment[i] + '</a></li>'
                }
                PassLines.html(PassLinesHtml);
                PassLines.find("li").eq(0).addClass("active");
                $("#PassLines li").each(function(){
                    if($(this).attr("class") == "active"){
                        lineId = $(this).children("a").text();
                    }
                });
                lineId = $("#PassLines li").eq(0).text();
                $("#PassLines li").live(activate, function(event) {
                    $(this).addClass("active").siblings().removeClass("active");
                     lineId = $(this).children("a").text();
                    lineTime(lineId)
                });
                lineTime(lineId);
            });
        });

        /*获取线路上下行信息*/


        $("#goBack").live(activate, function(event) {
            window.history.go(-1);
        })
        function lineTime(lineId){
            /*上行*/
            var lineInfoHtml='';
            net.get('showLineStations', {data: '{"isUpward":"true",lineId:'+ lineId  + '}'}, function(data){
                $.each(data.data, function (index, comment) {
                    var length = comment.length;
                    if(typeof(comment[i].upStartTime) != "undefined"){
                        upStartTime = net.getLocalTime(comment[i].upStartTime);
                    }else{
                        upStartTime = "";
                    }
                    if(typeof(comment[i].upEndTime) != "undefined"){
                        upEndTime = net.getLocalTime(comment[i].upEndTime);
                    }else{
                        upEndTime = "";
                    }
                    lineStartTime = upStartTime;
                    lineEndTime = upEndTime;
                    lineInfoHtml =
                        '<ul class="bs-cate bs-cate-btn"><li name = "true"><span class="name"> 上行：</span>'+ comment[0].stationName + '--'+ comment[length-1].stationName + '</li>'+
                        '<li><span class="name">起始时间：</span><span class="infotime">'+ lineStartTime + '/'+ lineEndTime + '</span></li>'
                    lineListUp.html(lineInfoHtml);
                    lineStainId(true,lineId);
                });

            });
            /*下行*/
            net.get('showLineStations', {data: '{"isUpward":"false",lineId:'+ lineId  + '}'}, function(data){
                $.each(data.data, function (index, comment) {
                    var length = comment.length;
                    var lineInfoHtml='';
                    if(typeof(comment[i].downStartTime) != "undefined"){
                        downStartTime = net.getLocalTime(comment[i].downStartTime);
                    }else{
                        downStartTime = "";
                    }
                    if(typeof(comment[i].downEndTime) != "undefined"){
                        downEndtime = net.getLocalTime(comment[i].downEndTime);
                    }else{
                        downEndtime = "";
                    }
                    lineStartTime = downStartTime;
                    lineEndTime = downEndtime;
                    lineInfoHtml =
                        '<ul class="bs-cate bs-cate-btn"><li name = "true"><span class="name"> 下行：</span>'+ comment[0].stationName + '--'+ comment[length-1].stationName + '</li>'+
                        '<li><span class="name">起始时间：</span><span class="infotime">'+ lineStartTime + '/'+ lineEndTime + '</span></li>'
                    lineListDown.html(lineInfoHtml);
                    lineStainId(false,lineId);

                });
            });
        }
        function lineStainId(isUpward,lineId){
            /*显示该车次所有站点名称*/
            net.get('showLineStations', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data) {
                $.each(data.data, function (index, comment) {
                    var lineListHtml = '';
                    var length = comment.length;
                    for (var i = 0; i <= length - 1; i++) {
                        if (comment[i].stationId == stationId) {
                            lineListHtml = lineListHtml +
                                '<li class="f-fcr" id =' + comment[i].stationId + '>' + comment[i].stationName + '</li>';
                        } else {
                            lineListHtml = lineListHtml +
                                '<li id =' + comment[i].stationId + '>' + comment[i].stationName + '</li>';
                        }
                    }
                    stationList.html(lineListHtml);
                    /*获得所有车次*/
                    var _index;
                    net.get('getRunningTrains', {data: '{"isUpward":"' + isUpward + '",lineId:' + lineId + '}'}, function (data) {
                        $.each(data.data, function (index, comment) {
                            var length = comment.length;
                            for (var i = 0; i <= length - 1; i++) {
                                $("#stationList li").each(function () {
                                    var _id = $(this).attr("id");
                                    var _this = $(this);
                                    if (comment[i].pastStationId == _id) {
                                        _this.attr("name", comment[i].trainId);
                                        _this.prepend("<i class='car-icon'></i>");
                                    }
                                    if (_this.text() == lineName) {
                                        _index = _this.index();
                                    }
                                })
                            }
                            for (var j = 0; j < _index; j++) {
                                if ($("#stationList li").eq(j).attr("name")) {
                                    trainIdList = trainIdList + $("#stationList li").eq(j).attr("name") + ',';
                                }
                            }
                            var trainIdStr = trainIdList.split(',');
                            var trainLength = trainIdStr.length;
                            trainId = trainIdStr.slice(trainLength - 2, trainLength - 1);
                            if (trainLength > 3) {
                                trainIds = trainIdStr.slice(trainLength - 4, trainLength - 2);
                            } else {
                                trainIds = trainIdStr.slice(trainLength - 3, trainLength - 2);
                            }
                            net.get('getTimeDiff', {data: '{"trainId":"'+ trainId + '","isUpward":"'+ isUpward + '",lineId:'+ lineId + ',stationId:'+ stationId +'}'}, function(data){
                                var lineInfoHtml = '';
                                $.each(data.data, function (index, comment) {
                                        lineInfoHtml =
                                            '<ul><li><span class="name">第一班次：</span><span class="infotime">'+ comment + '</span><span class="more-train" id="trainIds"></span></li></ul>';
                                    if(isUpward){
                                        lineListUp.append(lineInfoHtml);
                                    }else{
                                        lineListDown.append(lineInfoHtml);
                                    }

                                });
                            });
                        })
                    })
                })
            })
        }
    });
});
