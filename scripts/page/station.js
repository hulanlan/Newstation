require(['../config'], function(){
    require(['zepto', 'net'], function($, net){
        var activate = ('createTouch' in document) ? 'touchend' : 'click';
        var touchstart = ('createTouch' in document) ? 'touchstart' : 'click';
        var stationId = net.getParameterByName('stationId');
        var isUpward = net.getParameterByName('isUpward');
        var lineId = net.getParameterByName('lineId');
        var stationName =net.getParameterByName('stationName');
        $("#header").load("header.html", function() {
            $("#teamName").text(stationName);
        });
        var trainIdList = '',trainId = '',trainIds='';
        var stationList = $("#stationList");
        var isUpwardName;
        var lineInfo = $("#lineInfo");
        var downStartTime,downEndtime,upStartTime,upEndTime,lineStartTime,lineEndTime;
        if(isUpward == "true"){
            isUpwardName = "上行：";
        }else{
            isUpwardName = "下行：";
        }

        /*显示该车次所有站点名称*/
        net.get('showLineStations', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data){
            $.each(data.data, function (index, comment) {
                var lineListHtml = '';
                var length = comment.length;
                for(var i=0;i<=length-1;i++){
                    if(comment[i].stationId == stationId){
                        lineListHtml = lineListHtml +
                            '<li class="f-fcr" id ='+ comment[i].stationId + '>' + comment[i].stationName + '</li>';
                    }else{
                        lineListHtml = lineListHtml +
                            '<li id ='+ comment[i].stationId + '>' + comment[i].stationName + '</li>';
                    }
                }
                stationList.html(lineListHtml);
                /*获得所有车次*/
                var _index;
                net.get('getRunningTrains', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data){
                    $.each(data.data, function (index, comment) {
                        var length = comment.length;
                        for(var i=0;i<=length-1;i++){
                            $("#stationList li").each(function(){
                                var _id = $(this).attr("id");
                                var _this =$(this);
                                if(comment[i].pastStationId == _id){
                                    _this.attr("name",comment[i].trainId);
                                    _this.prepend("<i class='car-icon'></i>");
                                }
                                if(_this.text() == stationName ){
                                    _index = _this.index();
                                }
                            })
                        }
                        for(var j=0; j<_index; j++){
                            if($("#stationList li").eq(j).attr("name")){
                                trainIdList = trainIdList + $("#stationList li").eq(j).attr("name") + ',';
                            }
                        }
                        var trainIdStr = trainIdList.split(',');
                        var trainLength = trainIdStr.length;
                        trainId = trainIdStr.slice(trainLength-2,trainLength-1);
                        if(trainLength > 3){
                            trainIds = trainIdStr.slice(trainLength-4,trainLength-2);
                        }else{
                            trainIds = trainIdStr.slice(trainLength-3,trainLength-2);
                        }
                        net.get('showLineStations', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data){
                            var lineInfoHtml='',lineInfoHtmlMore='';
                            $.each(data.data, function (index, comment) {
                                var length = comment.length;
                                if(isUpward){
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
                                }else{
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
                                }
                                lineInfoHtml =
                                    '<ul><li name = "true"><span class="name">' + isUpwardName  +'</span>'+ comment[0].stationName + '--'+ comment[length-1].stationName + '</li>'+
                                    '<li><span class="name">起始时间：</span><span class="infotime">'+ lineStartTime + '/'+ lineEndTime + '</span></li>';
                                /*获取最近一站点时间*/
                                net.get('getTimeDiff', {data: '{"trainId":"'+ trainId + '","isUpward":"'+ isUpward + '",lineId:'+ lineId + ',stationId:'+ stationId +'}'}, function(data){
                                    $.each(data, function (index, comment) {
                                        if(typeof(comment.timeDiff) != "undefined"){
                                            lineInfoHtml +=
                                                '<li><span class="name">最近一班时间：</span><span class="infotime">'+ comment.timeDiff + '</span><span class="more-train" id="trainIds"></span></li>'+
                                                '</ul>';
                                        }
                                        lineInfo.html(lineInfoHtml);
                                    });
                                });
                                /*查看更多的车次信息*/
                                $("#trainIds").live(activate, function(event) {
                                    var trainClass = $(this).attr("class");
                                    if(trainClass == "more-train"){
                                        net.get('getTimeDiffBatch', {data: '{trainIds:"'+ trainIds.reverse() + '","isUpward":"'+ isUpward + '",lineId:'+ lineId + ',stationId:"'+ stationId +'"}'}, function(data){
                                            $.each(data.data, function (index, comment) {
                                                var length = comment.length;
                                                var lineInfoHtmlMore = '<ul class="ul-more">';
                                                for(var i=0;i<=length-1;i++) {
                                                    if (typeof(comment[i].timeDiff) != "undefined") {
                                                        lineInfoHtmlMore +=
                                                            '<li><span class="name">下一班时间：</span><span class="infotime">' + comment[i].timeDiff + '</span></li>';
                                                    }
                                                }
                                                lineInfo.append(lineInfoHtmlMore +'</ul>');
                                            });
                                        });
                                        $(this).attr("class","more-train-hide");
                                    }else{
                                        $(".ul-more").hide();
                                        $(this).attr("class","more-train");
                                    }

                                });
                            });
                        });
                    });
                });
            });
        });


        $("#goBack").live(activate, function(event) {
            window.history.go(-1);
        })
    });
});