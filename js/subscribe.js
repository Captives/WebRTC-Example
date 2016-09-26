var Red5Pro = null;
function SubscriberUtils(app, sdk){
    $('#stopBtn').click(this.stop);
    this.$startBtn = $('#startBtn');
    this.player = undefined;
    this.app = app;
    Red5Pro = sdk;
}

SubscriberUtils.prototype.rtmpListen = function (protocol, host, port, room, streamName) {
    var rtmpSource = {
        protocol: protocol,
        host: host,
        port: port,
        app: this.app,
        context: room, // Optional
        streamName: streamName,
        mimeType: 'rtmp/flv',// default
            // Comment/Uncomment the following to allow for default load of custom SWF in videojs lib.
            //swf: 'lib/red5pro/red5pro-video-js.swf'  // default
            // Comment/Uncomment the following to use red5pro-subscriber.swf which is the "live" SWF from Red5 Pro.
        useVideoJS: false // default: true
        , swf: 'lib/red5pro/red5pro-subscriber.swf'
    };

    var that = this;
    var subscriber = new Red5Pro.RTMPSubscriber();
    subscriber.init(rtmpSource)
        .then(function (_subscriber) {
            that.definePlayer(_subscriber);
        });
};

SubscriberUtils.prototype.rtcListen = function (protocol, host, port, room, streamName) {
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

    var rtcSource = {
        protocol: protocol,
        host: host,
        port: port,
        app: this.app,
        context: room,                   // Optional
        subscriptionId: 'subscriber-' + Math.floor(Math.random() * 0x10000).toString(16),
        streamName: streamName,
        streamType: "flash",
        iceServers: iceServers,
        bandwidth: {
            audio: 50,
            video: 256,
            data: 30 * 1000 * 1000
        }
    };

    var that = this;
    var subscriber = new Red5Pro.RTCSubscriber();
    subscriber.init(rtcSource).then(function (_subscriber) {
        that.definePlayer(_subscriber);
    });
};

SubscriberUtils.prototype.hlsListen = function (protocol, host, port, room, streamName) {
    var hlsSource = {
        protocol: protocol,
        host: host,
        port: port,
        app: this.app,
        context: room,                   // Optional
        streamName: streamName,
        mimeType: 'application/x-mpegURL',  // default
        swf: 'lib/red5pro/red5pro-video-js.swf'        // default
    };

    var that = this;
    var subscriber = new Red5Pro.HLSSubscriber();
    subscriber.init(hlsSource)
        .then(function(_subscriber) {
            that.definePlayer(_subscriber);
        });
};

SubscriberUtils.prototype.definePlayer = function (subscriber) {
    var that = this;
    var playback = new Red5Pro.PlaybackView('red5pro-subscriber');
    playback.attachSubscriber(subscriber);
    subscriber.play().then(function (selectedPlayer) {
        console.log('[index.html] - Player found: ' + selectedPlayer.getType());
        that.player = selectedPlayer;
    }).catch(function (error) {
        console.error('Could not set up player.\nReason: ' + error);
    });
};

SubscriberUtils.prototype.stop = function () {
    if(this.player !== undefined) {
        this.player.stop();
        this.player = undefined;
    }
};