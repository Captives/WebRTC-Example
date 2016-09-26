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

$(document).ready(function (e) {
    var view = window.query('view');
    $('.pagination > li[value="' + view + '"]').addClass('active').siblings().removeClass('active');
    $('.pagination > li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    var util = new PublisherUtils('live', red5prosdk);
    if (view == 'rtmp') {
        util.rtmpListen("rtmp", "192.168.22.5", 1935, null, 'publisher1');
        // util.rtcUnPublish();
    } else if (view == 'rtc') {
        util.rtcListen("ws", "192.168.22.5", "8081", null, 'publisher1');
        // util.unpublish();
    }
});
