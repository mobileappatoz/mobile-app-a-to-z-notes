importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyBia6NJz4EzgEaPovZO6hBuDxK_Vi8rdXA',authDomain:'mobile-app-a-to-z.firebaseapp.com',projectId:'mobile-app-a-to-z',messagingSenderId:'809211039150',appId:'1:809211039150:web:3bcab99765daa097facc3f'});
var m=firebase.messaging();
m.onBackgroundMessage(function(p){var d=p.data||{};self.registration.showNotification(d.title||'Mobile App A to Z',{body:d.body||'',icon:'/img/icon-192.png',badge:'/img/icon-192.png',data:{url:d.url||'/'}})});
self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'/';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(w){for(var i=0;i<w.length;i++){if(w[i].url.indexOf(u)>-1&&'focus' in w[i])return w[i].focus()}return clients.openWindow(u)}))});
