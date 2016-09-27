(function (window) {
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
    }

    window.query = getQueryVariable;
}(this));

this.publisherLog = function (message) {
    console.log('[PublisherSWF] ' + message);
};

var view = null;
var util = null;
$(document).ready(function (e) {
    console = new Console('console', console);

    view = window.query('view');
    $("#surl").text(localStorage.getItem('url'));
    $("#schannel").text(localStorage.getItem('channel'));
    $("#sname").text(localStorage.getItem('streamName'));

    util = new PublisherUtils('live', red5prosdk);
    $('.pagination > li[value="' + view + '"]').addClass('active').siblings().removeClass('active');
    $('.pagination > li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        window.location.href = window.location.href.replace(window.location.search,"")+"?view="+$(this).attr('value');
    });
});

$('#startBtn').click(function (e) {
    var streamName = localStorage.getItem('streamName') || "publisher1";
    var channel = localStorage.getItem('channel') || undefined;
    var url = localStorage.getItem('url') || 'localhost';
    if (view == 'rtmp') {
        util.rtmpListen("rtmp", url, 1935, channel, streamName);
    } else if (view == 'rtc') {
        util.rtcListen("ws", url, "8081", channel, streamName);
    }
});

$('#stopBtn').click(function(e){
    util.rtcUnPublish();
});


$('#conBtn').click(function (e) {
    if($(this).hasClass('label-success')){
        $(this).removeClass('label-success').addClass('label-danger').text('关闭');
        $('.console-box').show();
    }else{
        $(this).removeClass('label-danger').addClass('label-success').text('调试');
        $('.console-box').hide();
    }
});
