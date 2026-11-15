/* Zeekr Automotive synthetic download response experiment.
   Safe fixture: a valid tiny PNG reused with different Content-Type/filename headers.
   This is not an APK, and no install action occurs. */
'use strict';
var FIXTURE_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==';
var cases = {
  'png-name-png': { mime:'image/png', filename:'zeekr-sw-png.png' },
  'png-name-apk': { mime:'image/png', filename:'zeekr-sw-png.apk' },
  'apk-name-apk': { mime:'application/vnd.android.package-archive', filename:'zeekr-sw-apk.apk' },
  'text-name-apk':{ mime:'text/plain', filename:'zeekr-sw-text.apk' }
};
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(event){event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(event){
  var pathname;
  try{pathname=new URL(event.request.url).pathname;}catch(e){return;}
  var matched=pathname.match(/\/sw-attachment\/([a-z-]+)$/);
  if(!matched || event.request.mode!=='navigate') return;
  var item=cases[matched[1]];
  if(!item) return;
  event.respondWith((function(){
    var raw=atob(FIXTURE_PNG_BASE64), bytes=new Uint8Array(raw.length);
    for(var i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    return new Response(bytes,{
      status:200,
      headers:{
        'Content-Type':item.mime,
        'Content-Disposition':'attachment; filename="'+item.filename+'"',
        'Cache-Control':'no-store',
        'X-Zeekr-Probe':'service-worker-synthetic-response'
      }
    });
  })());
});
