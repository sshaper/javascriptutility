"use stict";

var Util = {};

Util.regex = '';

Util.checkElementAddListener = function(elementId, event, func) {
    if (document.getElementById(elementId)) {
        Util.addEventListener(document.getElementById(elementId), event, func);
    }
};

Util.checkElementRemoveListener = function(elementId, event, func) {
    if (document.getElementById(elementId)) {
        Util.removeEventListener(document.getElementById(elementId), event, func);
    }
};

/* BP IS AN OBJECT CONTAINING THE FOLLOWING PROPERTIES 
boxElement
titleElement
bodyElement
titleColor
title
body
time

bp stands for box properties
*/
Util.displayMessageBox = function(bp) {
    bp.boxElement.style.display = "block";
    bp.titleElement.style.display = bp.titleColor;
    bp.titleElement.innerHTML = bp.title;
    bp.bodyElement.innerHTML = bp.body;

    /*  IF THE TIME VALUE IS SENT THEN SHOW BOX FOR SET AMOUNT OF TIME AND THEN CLEAR ALL MESSAGE TEXT AND MAKE BOX DISPLAY NONE, OTHERWISE JUST DISPLAY THE BOX.*/
    if (bp.time) {
        setTimeout(function() {
            bp.boxElement.style.display = "none";
            bp.titleElement.innerHTML = "";
            bp.bodyElement.innerHTML = "";
        }, bp.time);
    }
};

/*
boxElement
titleElement
bodyElement
*/
Util.closeMessageBox = function(bp) {
    bp.boxElement.style.display = "none";
    bp.titleElement.innerHTML = "";
    bp.bodyElement.innerHTML = "";
};

Util.sendRequest = function(url, callback, postData, file) {

    /*SET FILE TO FALSE IF IT IS NOT ALREADY SET.  IF IT IS SET THEN
    IT IS SUPPOSED TO BE TRUE.  IF IT IS SET TO TRUE THAT INDICATES THAT A FILE IS
    BEING SENT.*/
    if (file === undefined) {
        file = false;
    }

    /*CREATES THE XML OBJECT*/
    var req = Util.createXMLHttpObject();

    /*IF RETURNS FALSE CANCEL OPERATION*/
    if (!req) {
        return;
    }

    /*CHECK TO SEE IF POSTDATA WAS PASSED IF SO SET METHOD TO POST*/
    var method = (postData) ? "POST" : "GET";

    /*CALL THE OPEN METHOD, SEND THE METHOD "POST" OR "GET" AND PASS TRUE*/
    req.open(method, url, true);

    /*IF POSTDATA IS SENT AND THE FILE IS ZERO MEANING WE ARE NOT SENDING A FILE THEN SET REQUEST HEADER FOR FORMS, OTHERWISE JAVASCRIPT WILL DECIDE THE HEADER TYPE ON THE REQ.SEND METHOD*/
    if (postData && !file) {
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    /*IF EVERYTHING RETURNS OK SEND REQ VALUE TO "CALLBACK"*/
    req.onreadystatechange = function() {
        if (req.readyState !== 4) return;
        if (req.status !== 200 && req.status !== 304) {
            return;
        }
        callback(req);
    };

    /*IF WE HAVE ALREADY COMPLETED THE REQUEST, STOP THE FUNCTION SO AS NOT
    TO SEND IT AGAIN*/
    if (req.readyState === 4) {
        return;
    }

    /*IF POSTDATA WAS INCLUDED SEND IT TO SERVER SIDE PAGE. INFORMATION
    CAN BE RECEIVED BY USING $_POST['DATA'] (THIS IS VIA PHP)
  
    SENDING A FILE AND SOME TEXT*/
    if (postData && file) {
        req.send(postData);
    }
    /*SENDING TEXT ONLY*/
    else if (postData && !file) {
        req.send("data=" + postData);
    } else {
        req.send(null);
    }

};

/*DEPENDING ON THE BROWSER RETURN APPROPRIATE REQUEST.*/
Util.XMLHttpFactories = [
    function() {
        return new XMLHttpRequest();
    },
    function() {
        return new ActiveXObject("Msxml2.XMLHTTP");
    },
    function() {
        return new ActiveXObject("Msxml3.XMLHTTP");
    },
    function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
];

/*THIS METHOD CYCLES THROUGH ALL REQUESTS IN XMLHTTPFACTORIES UNTIL
ONE IS FOUND.*/
Util.createXMLHttpObject = function() {
    var xmlhttp = false;
    for (var i = 0; i < Util.XMLHttpFactories.length; i++) {
        try {
            xmlhttp = Util.XMLHttpFactories[i]();
        } catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
};



/*W3C DOM 2 EVENTS MODEL*/
if (document.addEventListener) {

    Util.addEventListener = function(target, type, listener) {
        target.addEventListener(type, listener, false);
    };

    Util.stopPropagation = function(event) {
        event.stopPropagation();
    };
    Util.preventDefault = function(event) {
        event.preventDefault();
    };
    Util.removeEventListener = function(target, type, listener) {
        target.removeEventListener(type, listener, false);
    };

} else if (document.attachEvent) {
    Util.addEventListener = function(target, type, listener) {
        /*PREVENT ADDING THE SAME LISTENER TWICE, SINCE DOM 2 EVENTS IGNORES
        DUPLICATES LIKE THIS*/
        if (Util._findListener(target, type, listener) != -1) return;

        /*LISTENER2 CALLS LISTENER AS A METHOD OF TARGET IN ONE OF TWO WAYS,
        DEPENDING ON WHAT THIS VERSION OF IE SUPPORTS, AND PASSES IT THE GLOBAL
        EVENT OBJECT AS AN ARGUMENT*/
        var listener2 = function() {
            var event = window.event;

            if (Function.prototype.call) {
                listener.call(target, event);
            } else {
                target._currentListener = listener;
                target._currentListener(event);
                target._currentListener = null;
            }
        };

        /*ADD LISTENER2 USING IE'S ATTACHEVENT METHOD*/
        target.attachEvent("on" + type, listener2);

        /*THE ABOVE CODE ALLOWS US TO CREATE AN EVENT LISTENER FOR IE
        AND BE ABLE TO USE THE "THIS" KEYWORD.  THE CODE BELOW STORES 
        OUR OBJECT REFERENCES SO THE CAN BE CLEANED UP LATER.  THIS 
        STOPS ANY MEMORY LEAK ISSUES.
    

        CREATE AN OBJECT DESCRIBING THIS LISTENER SO WE CAN CLEAN IT UP LATER*/
        var listenerRecord = {
            target: target,
            type: type,
            listener: listener,
            listener2: listener2
        };

        /*GET A REFERENCE TO THE WINDOW OBJECT CONTAINING TARGET*/
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        /*CREATE A UNIQUE ID FOR THIS LISTENER*/
        var listenerId = "l" + Util._listenerCounter++;

        /*STORE A RECORD OF THIS LISTENER IN THE WINDOW OBJECT*/
        if (!targetWindow._allListeners) targetWindow._allListeners = {};
        targetWindow._allListeners[listenerId] = listenerRecord;

        /*STORE THIS LISTENER'S ID IN TARGET*/
        if (!target._listeners) target._listeners = [];
        target._listeners[target._listeners.length] = listenerId;

        /*SET UP UTIL._REMOVEALLLISTENERS TO CLEAN UP ALL LISTENERS ON UNLOAD*/
        if (!targetWindow._unloadListenerAdded) {
            targetWindow._unloadListenerAdded = true;
            targetWindow.attachEvent("onunload", Util._removeAllListeners);
        }
    };

    Util.stopPropagation = function(event) {
        event.cancelBubble = true;
    };

    Util.preventDefault = function(event) {
        event.returnValue = false;
    };

    Util.removeEventListener = function(target, type, listener) {
        /*FIND OUT IF THE LISTENER WAS ACTUALLY ADDED TO TARGET*/
        var listenerIndex = Util._findListener(target, type, listener);
        if (listenerIndex == -1) return;

        /*GET A REFERENCE TO THE WINDOW OBJECT CONTAINING TARGET*/
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        /*OBTAIN THE RECORD OF THE LISTENER FROM THE WINDOW OBJECT*/
        var listenerId = target._listeners[listenerIndex];
        var listenerRecord = targetWindow._allListeners[listenerId];

        /*REMOVE THE LISTENER, AND REMOVE ITS ID FROM TARGET*/
        target.detachEvent("on" + type, listenerRecord.listener2);
        target._listeners.splice(listenerIndex, 1);

        /*REMOVE THE RECORD OF THE LISTENER FROM THE WINDOW OBJECT*/
        delete targetWindow._allListeners[listenerId];
    };


    Util._findListener = function(target, type, listener) {
        /*GET THE ARRAY OF LISTENER IDS ADDED TO TARGET*/
        var listeners = target._listeners;
        if (!listeners) return -1;

        /*GET A REFERENCE TO THE WINDOW OBJECT CONTAINING TARGET*/
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        /*SEARCHING BACKWARD (TO SPEED UP ON UNLOAD PROCESSING), FIND THE LISTENER*/
        var len = listeners.length;
        for (var i = len - 1; i >= 0; i--) {
            /*GET THE LISTENER'S ID FROM TARGET*/
            var listenerId = listeners[i];

            /*GET THE RECORD OF THE LISTENER FROM THE WINDOW OBJECT*/
            var listenerRecord = targetWindow._allListeners[listenerId];

            /*COMPARE TYPE AND LISTENER WITH THE RETRIEVED RECORD*/
            if (listenerRecord.type == type && listenerRecord.listener == listener) {
                return i;
            }
        }
        return -1;
    };

    Util._removeAllListeners = function() {
        var targetWindow = this;
        /*THIS IS A FOR LOOP GOING THOUGH AN ASSOCIATIVE ARRAY*/
        var id = 0;
        while (id < targetWindow._allListeners) {
            var listenerRecord = targetWindow._allListeners[id];
            listenerRecord.target.detachEvent("on" + listenerRecord.type, listenerRecord.listener2);
            delete targetWindow._allListeners[id];

            id++;
        }
    };

    Util._listenerCounter = 0;
} /*ELSE IF (DOCUMENT.ATTACHEVENT)*/

Util.validation = function(name, str, regex, errorArray, message) {
    var tempObj = {};
    switch (regex) {
        case 'generalText':
            Util.regex = Util.generalText();
            break;
        case 'email':
            Util.regex = Util.email();
            break;
    }

    if (!Util.regex.test(str)) {
        tempObj = {
            'id': name,
            'error': message
        };

        errorArray.push(tempObj);
        return errorArray;
    } else {
        return errorArray;
    }
};

Util.generalText = function() {
    return /^[a-zA-Z]{1,1}[a-zA-Z0-9\s\'\"]+/;
};

Util.email = function() {
    return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
};

Util.clearErrors = function() {
    var labels = document.getElementsByTagName('label');
    var i = 0;
    while (i < labels.length) {
        if (labels[i].lastChild.nodeName.toLowerCase() == 'span') {
            labels[i].removeChild(labels[i].lastChild);
        }
        i++;
    }
};