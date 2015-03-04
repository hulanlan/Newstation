require(['../config','../common/exchangeNum'], function(){
    require(['zepto', 'net','touch','highlight','gmu','event','widget','suggestion'], function($, net,widget,suggestion){
        var formStyle = "searchLines";
        var params,states;
        var searchInput = $('#searchInput');
        var activate = ('createTouch' in document) ? 'touchend' : 'click';
        var touchstart = ('createTouch' in document) ? 'touchstart' : 'click';
        states = [ '一号线','二号线','三号线','四号线','五号线','六号线','七号线','八号线','九号线','十号线','十一号线','十二号线','十三号线','十四号线','十五号线','十六号线', '1号线','2号线','3号线','4号线','5号线','6号线','7号线','8号线','9号线','10号线','11号线','12号线','13号线','14号线','15号线','16号线'];
        $('#header').load('header.html');
        

        $(".bs-nav li").live(activate, function(event) {
            $("#searchInput").val("");
            var _this = $(this);
            _this.addClass("active").siblings().removeClass("active");
            formStyle = _this.find("a").attr("id");
            if(formStyle == 'searchLines'){
                states = [ '一号线','二号线','三号线','四号线','五号线','六号线','七号线','八号线','九号线','十号线','十一号线','十二号线','十三号线','十四号线','十五号线','十六号线'];
            }else{
                states = [ '莘庄','外环路','莲花路','锦江乐园','上海南','漕宝路','上海体育馆','徐家汇','衡山路','常熟路','陕西南路','黄陂南路','人民广场','新闸路',
                    '汉中路','上海火车','中山北路','延长路','上海马戏城','汶水路','彭浦新村','共康路','通河新村','呼兰路','共富新村','宝安公路','友谊西路',
                    '徐泾东','虹桥火车','虹桥2号航楼','淞虹路','北新泾','威宁路','娄山关路','中山公园','江苏路','静安寺','南京西路','南京东路','陆家嘴',
                    '东昌路','上海科技馆','世纪公园','龙阳路','张江高科','金科路','广兰路','唐镇','创新中路','华夏东路','川沙','凌空路','石龙路',
                    '龙漕路','漕溪路','虹桥路','延安西路','金沙江路','曹杨路','镇坪路','中潭路','宝山路','东宝兴路','虹口足球场',
                    '赤峰路','大柏树','江湾镇','殷高西路','长江南路','淞发路','张华浜路','淞滨路','水产路','宝杨路','友谊路',
                    '海伦路','临平路','杨树浦路','浦东大道','世纪大道','浦电路','蓝村路',
                    '塘桥','南浦大桥','西藏南路','鲁班路','大木桥路','东安路','上海体育场','春申路','银都路','颛桥','北桥','剑川路','东川路',
                    '金平路','华宁路','文井路','闵行开发区','港城路','外高桥保税区北','航津路','外高桥保税区南','洲海路','五洲大道','东靖路','巨峰路','五莲路','博兴路',
                    '金桥路','云山路','德平路','北洋泾路','民生路','源深体育中心','上海儿童医学中心','临沂新村','高科西路','东明路','高青路',
                    '华夏西路','上南路','灵岩南路','美兰湖','罗南新村','潘广路','刘行','顾村公园','祁华路','上海大学','南陈路','上大路','场中路','大场镇',
                    '行知路','大华三路','新村路','岚皋路','长寿路','昌平路','肇嘉浜路','龙华中路','后滩','长清路','耀华路','云台路',
                    '市光路','嫩江路','翔殷路','黄兴公园','延吉中路','黄兴路','江浦路','鞍山新村','四平路','曲阳路','西藏北路','中兴路','曲阜路','大世界',
                    '老西门','陆家浜路','中华艺术宫','成山路','杨思','东方体育中心','凌兆新村','芦恒路','浦江镇','杨高中路','商城路','小南门',
                    '马当路','打浦桥','嘉善路','宜山路','桂林路','漕河泾开发区','合川路','星中路','七宝','中春路','九亭','泗泾','佘山','洞泾',
                    '松江大学城','松江新城','松江体育中心','醉白池','松江南','新江湾城','殷高东路','三门路','江湾体育场','五角场','国权路','同济大学','邮电新村','四川北路',
                    '豫园','新天地','陕西南路','上海图书馆','交通大学','宋园路','伊犁路','水城路','龙溪路','上海动物园','虹桥1号航楼',
                    '嘉定北','嘉定西','白银路','嘉定新城','马陆','南翔','桃浦新村','武威路','祁连山路','李子园','上海西','真如','枫桥路','隆德路',
                    '上海游泳馆','龙华','云锦路','龙耀路','三林','三林东','浦三路','御桥','天潼路','国际客运中心','提篮桥','大连路',
                    '江浦公园','宁国路','隆昌路','爱国路','复兴岛','东陆路','巨峰路','杨高北路','金京路','申江路','金海路','金运路','金沙江西路','丰庄','祁连山南路','真北路',
                    '大渡河路','隆德路','武宁路','滴水湖','临港大道','书院','惠南东','惠南','野生动物园','新场','航头东','鹤沙航城','周浦东','罗山路','华夏中路'
                ];
            }
        });
        searchInput.suggestion({
            sendrequest: function (e, query, render, cacheData) {
                var listArr = [];

                $.each(states, function (i, item) {
                    ~item.indexOf( query ) && listArr.push( item );
                });
                render( query, listArr );
                cacheData( query, listArr );
            },
            renderlist: function (e, data, query, callback) {
                // renderList的回调函数callback(listHtml), listHtml为sug列表内容
                callback.call( this, data.map(function (item) {
                    return '<div class="sug-item">' + item + '</div>';
                }).join( ' ' ) );
                $(".ui-suggestion").css("top",-$(".ui-suggestion").height());
            }
        });
        $(".sug-item").live(activate, function(event) {
            searchInput.val($(this).text());
            $(".ui-suggestion").hide();
        })
        //点击搜索按钮
        $("#searchBtn").live(activate, function(event) {
            var searchInput = $("#searchInput").val();
            var lineName = new change(searchInput).pri_ary();
            if(formStyle == 'searchLines'){
                params ={
                    data :'{keyword:"' + lineName + '"}'
                };
            }else{
                params ={
                    data :'{keyword:"' + searchInput + '"}'
                }
            }
            var slipName;
            net.get(formStyle, params, function(data){
                if(formStyle == 'searchLines'){
                    $.each(data.data, function(index, comment) {
                        for(var i=0;i<=comment.length-1;i++){
                            if(comment[i].linename == lineName){
                                slipName = comment[i].id;
                                window.location.href =formStyle +  '.html?lineId='+slipName;
                            }
                        }
                    });
                }else{
                    $.each(data.data, function(index, comment) {
                        for(var i=0;i<=comment.length-1;i++){
                            if(comment[i].stationname == searchInput){
                               slipName = comment[i].id;
                               window.location.href ='stationTimeList.html?stationId='+ slipName +'&isUpward=false'+'&lineName='+ $("#searchInput").val();
                            }
                        }
                    });
                }
            });

        });
        $("#goBack").live(activate, function(event) {
            window.history.go(-1);
        });
    });
});