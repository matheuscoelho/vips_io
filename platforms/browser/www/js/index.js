/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup pushh');








var allPermissions = [];

function init(){
    var $permissions = $('#permissions');
    for(var permission in cordova.plugins.diagnostic.runtimePermission){
        var $permission = $('#template .permission').clone();
        $permission.addClass(permission);
        $permission.find('.name').text(underscoreToSpace(permission));
        $permissions.append($permission);
        $permission.find('button').on("click", requestPermission);
        allPermissions.push(permission);
    }
    checkPermissions();
}

function showAlert(title, text){
    navigator.notification.alert(text, null, title);
}

function underscoreToSpace(value){
    return value.replace(/_/g," ");
}

function spaceToUnderscore(value){
    return value.replace(/ /g,"_");
}

function checkPermissions(){
    cordova.plugins.diagnostic.getPermissionsAuthorizationStatus(onCheckPermissions, onCheckPermissionsError, allPermissions);
}

function onCheckPermissions(statuses){
    for(var permission in statuses){
        var $permission = $('#permissions .'+permission),
            status = statuses[permission];
        $permission.find('.status').text(underscoreToSpace(status));
        if(status == "GRANTED" || status == "DENIED_ALWAYS"){
            $permission.find('button').hide();
        }
    }
}

function onCheckPermissionsError(error){
    showAlert("Error checking permissions", "An error occurred while checking permissions: "+error);
}

function requestPermission(){
    var permission = spaceToUnderscore($(this).parents('tr').find('.name').text());
    $('#requesting').show();
    cordova.plugins.diagnostic.requestRuntimePermission(onRequestPermission.bind(this, permission), onRequestPermissionError.bind(this, permission), permission);
}

function onRequestPermission(permission, status){
    $('#requesting').hide();
    console.log(permission+" is "+status);
    checkPermissions();
}

function onRequestPermissionError(permission, error){
    $('#requesting').hide();
    showAlert("Error requesting permission", "Ane error occurred while request permission '"+permission+"': "+error);
}












        init();
        app.setupPush();

    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "249880936399"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
                );
        });
    },
    capturaFoto: function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });

        function onSuccess(imageURI) {
           // var image = document.getElementById('myImage');
           // image.src = imageURI;
           alert(imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }
};
