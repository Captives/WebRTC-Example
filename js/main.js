function PublisherUtils(app, sdk){
    $('#stopBtn').click(this.stop);
    this.$startBtn = $('#startBtn');
    this.publisher = undefined;
    this.app = app;
    this.sdk = sdk;
}

PublisherUtils.prototype.rtcListen = function (protocol,host, port, room, streamName) {
    var className = "[WebRTC]";
    var iceServers = [];
    var isMoz = !!navigator.mozGetUserMedia;
    if(isMoz) {
        iceServers.push({urls: 'stun:stun.services.mozilla.com:3478'});
    } else {
//      iceServers.push({urls: 'stun:stun.l.google.com:19302'});
//      iceServers.push({urls: 'stun:stun1.l.google.com:19302'});
        iceServers.push({urls: 'stun:stun2.l.google.com:19302'});
//      iceServers.push({urls: 'stun:stun3.l.google.com:19302'});
//      iceServers.push({urls: 'stun:stun4.l.google.com:19302'});
//      iceServers.push({urls: 'stun:stun01.sipphone.com'});
        /**
         iceServers.push({url: 'stun:' + host + ':3478'});
         iceServers.push({url: 'turn:' + host + ':3478?transport=udp',credential: 'webrtc',username: 'webrtc'});
         */
    }

    // app:"live"
    // context:undefined
    // host:"192.168.22.5"
    // iceServers:Array[1]
    // port:"8081"
    // protocol:"ws"
    // streamName:"publisher1"
    // streamType:"webrtc"

    var rtcSource = {
        protocol: protocol,
        port: port,
        host: host,
        app: this.app,
        context: room,
        streamName: streamName,
        streamType: "webrtc",
        iceServers: iceServers
    };

    console.log(className,'connect url',protocol+"://"+host+":"+port, room, streamName);

    var that = this;
    var publish = new that.sdk.RTCPublisher();
    var publishView = new that.sdk.PublisherView('red5pro-publisher');
    //打开本地摄像头
    navigator.getUserMedia({
        audio:true,
        video:true
    },function (media) {
        console.log(className, "create Media", media);
        publish.attachStream(media);
        publishView.preview(media);
    },function (err) {
        console.error(error);
    });
    publishView.attachPublisher(publish);
    //初始化
    publish.init(rtcSource).then(function (_publisher) {
        console.log(className, 'Publisher found: ' + _publisher.getType());
        console.log(className, _publisher);
        that.publisher = _publisher;
        //开始发布视频
        that.rtcPublish();
    }).catch(function (err) {
        console.error('Could not set up publisher:\nReason: ' + err);
    });
};

/**
 * WebRTC 发布
 */
PublisherUtils.prototype.rtcPublish = function () {
    this.publisher.publish().then(function () {
        console.log('[WebRTC] - Publish started.');
    }).catch(function (err) {
        console.error('[WebRTC] - Publish failed: ' + err);
    });
};

PublisherUtils.prototype.rtcUnPublish = function () {
    var that = this;
    if(this.publisher !== undefined){
        this.publisher.unpublish().then(function () {
            console.log('[WebRTC] - Unpublish complete.');
            that.publisher = undefined;
        }).catch(function (err) {
            console.error('[WebRTC] - Unpublish failed: ' + err);
        });
    }
};

PublisherUtils.prototype.rtmpListen = function (protocol,host,port, room, streamName) {
    var className = "[RTMP]";
    var rtmpSource = {
        protocol: protocol,
        port: port,
        host: host,
        app: this.app,
        context: room,
        streamName: streamName,
        swf: 'lib/red5pro/red5pro-publisher.swf'
    };

    console.log(className, 'connect url',protocol+"://"+host+":"+port, room, streamName);

    var that = this;
    var publish = new that.sdk.RTMPPublisher();
    var publishView = new that.sdk.PublisherView('red5pro-publisher');

    publishView.attachPublisher(publish);
    publish.init(rtmpSource).then(function(_publisher){
        console.log(className, 'Publisher found: ' + _publisher.getType());
        console.log(className, _publisher);
        that.publisher = _publisher;
        that.rtcPublish();
    }).catch(function (error) {
        console.error(className, 'Could not set up publisher:\nReason: ' + error);
    });
};

PublisherUtils.prototype.unpublish = function () {
    if(this.publisher !== undefined){
        this.publisher.unpublish().then(function () {
            this.publisher = undefined;
            console.log('[RTMP] - Unpublish complete.');
        }).catch(function (err) {
            console.error('[RTMP] - Unpublish failed: ' + err);
        });

    }
};
