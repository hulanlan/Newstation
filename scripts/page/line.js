require(['../config'], function(){
    require(['zepto', 'net'], function($, net){
        var activate = ('createTouch' in document) ? 'touchend' : 'click';
        var touchstart = ('createTouch' in document) ? 'touchstart' : 'click';
        $('#header').load('header.html');
        var lineId = net.getParameterByName('lineId');
        var lineList =$("#lineList");
        var lineInfo = $("#lineInfo");
        var isUpward = true;//默认状态为上行
        var downStartTime,downEndtime,upStartTime,upEndTime,lineStartTime,lineEndTime;
        //获取上行、下行记录
        net.get('showLineStations', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data){
            $.each(data.data, function (index, comment) {
                var length = comment.length;
                var lineInfoHtml =
                    '<ul><li name = "true"><span>上行：</span>'+
                    comment[0].stationName + '-'+ comment[length-1].stationName +'<span class="infotime">('+ net.getLocalTime(comment[0].upStartTime) + '/'+ net.getLocalTime(comment[0].upEndTime) + ')</span></li>'+
                    '<li name = "false"><span>下行：</span>' + comment[length-1].stationName +  '-'+ comment[0].stationName +'<span class="infotime">('+ net.getLocalTime(comment[length-1].downStartTime) + '/' + net.getLocalTime(comment[length-1].downEndTime) + ')</span></li></ul>';
                lineInfo.append(lineInfoHtml);
            });
        });
        lineListShow(isUpward);
        $("#lineInfo li").live(activate, function(event) {
            isUpward = $(this).attr("name");
            lineListShow(isUpward);
        });
        $("#lineList li").live(activate, function(event) {
            var stationId = $(this).eq(0).attr("id");
            window.location.href = 'searchStations.html?stationId='+ stationId +'&isUpward='+ isUpward + '&lineId='+ lineId + '&stationName='+ $(this).text();
        });
        $("#goBack").live(activate, function(event) {
            window.history.go(-1);
        })
        //显示线路站点
        function lineListShow(isUpward){
            net.get('showLineStations', {data: '{"isUpward":"'+ isUpward + '",lineId:'+ lineId +'}'}, function(data){
                $.each(data.data, function (index, comment) {
                    var lineListHtml = '';
                    var length = comment.length;
                    for(var i=0;i<=length-1;i++){
                        //显示时间的判断
                        //alert(comment[i].downEndTime)
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

                        lineListHtml = lineListHtml +
                            '<ul><li id ='+ comment[i].stationId +'>'+ comment[i].stationName + '</li><li>&nbsp;</li></li><li>' + lineStartTime + '/' + lineEndTime +'</li></ul>';

                    }
                    lineList.html(lineListHtml);
                });
            });
        }
    });
});
