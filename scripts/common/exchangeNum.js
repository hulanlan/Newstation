/**
 * Created by hulanlan656 on 2015/2/12.
 */
var _change = {
    ary0:["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
    ary1:["", "十", "百", "千"],
    ary2:["", "万", "亿", "兆"],
    init:function (name) {
        this.name = name;
    },
    strrev:function () {
        var ary = []
        var reg = /[1-9][0-9]*/g;
        var numList = this.name.match(reg);
        ary.push(numList)
        return ary.join("");
    }, //倒转字符串。
    pri_ary:function () {
        var $this = this
        var ary = this.strrev();
        var zero = ""
        var newary = ""
        var i4 = 0
        var length = ary.length;
        var chinese = this.name.substring(length);
        if(ary > 10){
            newary = "十" + this.ary0[parseInt(ary[1])];
        }else if(ary == 10){
            newary =  "十" ;
        }else if(ary >0 && ary <10){
            newary = newary + this.ary0[parseInt(ary)];
        }

        if (newary.indexOf("零") == 0) {
            newary = newary.substr(1)
        }//处理前面的0
        return newary+chinese;
    }
}

//创建class类
function change() {
    this.init.apply(this, arguments);
}
change.prototype = _change