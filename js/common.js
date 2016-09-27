/********************************************************
 *      运行日志
 *********************************************************/
function Console(id, console) {
    var div = document.getElementById(id);
    function createMessage(msg, color) {
        // Sanitize the input
        msg = msg.toString().replace(/</g, '&lt;');
        var span = document.createElement('SPAN');
        if (color != undefined) {
            span.style.color = color;
        }
        span.appendChild(document.createTextNode(msg));
        return span;
    }

    function text(args){
        var arr = Array.prototype.slice.call(args);
        var date = new Date();
        arr.unshift(date.toLocaleDateString() +" " +
            date.getHours() + ":"+date.getSeconds() + ":"+date.getMinutes()+"."+date.getMilliseconds());
        var str = arr.join(" ");
        return str;
    }

    this._append = function(element) {
        if(div){
            div.appendChild(element);
            div.appendChild(document.createElement('BR'));
            // $(window).scrollTo('max', {duration: 500});
        }
    };

    /**
     * Show an Error message both on browser console and on defined DIV
     *
     * @param msg: message or object to be shown
     */
    this.error = function() {
        msg = text(arguments);
        console.error(msg);
        this._append(createMessage(msg, "#FF0000"));
    };

    /**
     * Show an Warn message both on browser console and on defined DIV
     *
     * @param msg:
     *            message or object to be shown
     */
    this.warn = function() {
        var msg = text(arguments);
        console.warn(msg);
        this._append(createMessage(msg, "#FFA500"));
    };

    /**
     * Show an Info message both on browser console and on defined DIV
     *
     * @param msg:
     *            message or object to be shown
     */
    this.info = this.log = function() {
        var msg = text(arguments);
        console.info(msg);
        this._append(createMessage(msg));
    };

    /**
     * Show an Debug message both on browser console and on defined DIV
     *
     * @param msg:
     *            message or object to be shown
     */
    this.debug = function() {
        var msg = text(arguments);
        console.log(msg);
        this._append(createMessage(msg, "#0000FF"));
    };
}
