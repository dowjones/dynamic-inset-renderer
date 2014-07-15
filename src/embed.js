(function(){
  if(document.getElementsByClassName('js-embed-enabled').length === 0){
    var script = document.createElement('script');
    script.setAttribute('src','//dynamic-inset-renderer.elasticbeanstalk.com/release/js/script.js');
    script.setAttribute('type','text/javascript');
    script.setAttribute('async', 'true');
    document.getElementsByTagName('head')[0].appendChild(script).classList.add("js-embed-enabled");
  }
})();
