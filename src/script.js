;(function(){
  console.log('require script has executed');


  /***
    The ready function does not fire until require has been either validated to
    be on the page, or dynamically loaded.

    This function loads additional dependencies, then runs the main
    parseInsets() function, which does all of the heavy lifting.
  ***/
  var ready = function(){

    requirejs.config({
        "paths": {
          "jquery":"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
          "async":"//cdnjs.cloudflare.com/ajax/libs/async/1.22/async.min",
          "hogan":"//cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.0/hogan"
        }
    });

    require(['jquery', 'async', 'hogan'], function() {
      parseInsets();
    });

  };

  /***
    parseInsets first finds all appropriately classed script elements, then
    launches an async routine on them that:

    1. get_inset takes the data-inset-url attribute and fetches the inset
    2. get_inset_template parses the returned get_inset template location,
       and fetches the template
    3. get_inset_data parses the returned get_inset data location,
       and fetches the data
    4. rendered_inset takes the data and template resource, and combines them
       using hogan

    Upon completion, each script tag is wrapped with a container div,
    and the rendered inset returned from the async request is attached as a child.

    If sharing is enabled on the inset (either via a data-inset-sharing attribute
    or as defined in the inset json file), a separate shareInset function is fired.

  ***/
  var parseInsets = function(){
    //loop through all script tags that are insets
    $('script.js-embed').each(function(index, element){

      async.auto({
        //fetch the remote inset.json file from the data-inset-url attribute on the script tag
        get_inset:function(callback){
          var origin = $(element).attr('data-inset-url');
          $.getJSON($(element).attr('data-inset-url'), function(response){
            console.log('get_inset done');
            if(response.status == "OK") {
              response.origin = origin;
              callback(null, response);
            } else {
              console.log("Rendering disabled: inset status not OK.");
              return false;
            }
          });
        },
        get_inset_template:['get_inset', function(callback, results){
          //if clientside information is present, use it instead of serverside
          var template = (results.get_inset.clientside) ? results.get_inset.clientside.template : results.get_inset.serverside.template;
          //if there is an inline template in the inset.json file, use it
          if(template.template !== undefined) {
            console.log('get_inset_template from inset.json done');
            callback(null, template.template);
          } else {
            //if there isn't an inline template, fetch the remote template
            $.get(template.url, function(response){
              console.log('get_inset_template done');
              callback(null, response);
            });
          }
        }],
        get_inset_data:['get_inset', function(callback, results){
          //if clientside information is present, use it instead of serverside
          var data = (results.get_inset.clientside) ? results.get_inset.clientside.data : results.get_inset.serverside.data;
          //if there inline data in the inset.json file, use it
          if(data.data !== undefined) {
            console.log('get_inset_data from inset.json done');
            callback(null, data.data);
          } else {
            //if there isn't inline data, fetch the remote data
            $.get(data.url, function(response){
              console.log('get_inset_data done');
              callback(null, response);
            });
          }
        }],
        rendered_inset:['get_inset', 'get_inset_template', 'get_inset_data', function(callback, results){
          // var rendered_template = Mustache.render(results.get_inset_template, results.get_inset_data);
          var template = Hogan.compile(results.get_inset_template);
          var rendered_template = template.render(results.get_inset_data);
          callback(null, rendered_template);
        }]
      }, function(err, results){
        // console.log(results)
        // console.log(results.rendered_inset);
        $(element).wrap("<div class=dynamicInset id=inset"+index+">").after(results.rendered_inset);
        if((results.get_inset.sharing === false) || ($(element).attr('data-inset-sharing') == 'false')) {
          console.log("sharing disabled");
        } else {
          shareInset('inset'+index, results.get_inset.origin);
        }
      });
    });
  };

  var loadCSS = function(){
    $('<link type=text/css rel=stylesheet href=//dynamic-inset-renderer.elasticbeanstalk.com/release/css/style.css>').appendTo("head");
  };

  /***
    shareInset creates a set of tools alongside of each rendered inset, with links to
    twitter and a script embed code.
  ***/
  var shareInset = function(id, origin) {
    console.log("sharing enabled");
    loadCSS();

    var sharetools = '\
    <div class="share">\
      <ul>\
        <li>\
          <a class="insetTwitterIcon insetIcon" href="http://twitter.com/share?url=http://dynamic-inset-renderer.elasticbeanstalk.com/inset?url='+origin+'">twitter</a>\
        </li>\
        <li>\
          <a class="insetEmbedIcon insetIcon" id=embed-'+id+'>embed</a>\
        </li>\
      </ul>\
    </div>';

    $inset = $('#'+id);
    $inset.wrapInner('<div class=inset>');
    $inset.children('.inset').after(sharetools);
    $inset.find('#embed-'+id).one("click", function(e){
      e.preventDefault();
      $this = $(this);
      $this.hide();
      var embedCode = '&lt;script data-inset-url="'+origin+'" src="//dynamic-inset-renderer.elasticbeanstalk.com/release/js/embed.js" class="js-embed" &gt;&lt;/script&gt;';
      $("<code>"+embedCode+"</code>").insertAfter($this);
    });
  };

  if(!window.requirejs) {
    var script = document.createElement('script');
    script.src = '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js';
    script.type = 'text/javascript';
    script.onload = function(){ ready(); };
    document.getElementsByTagName('head')[0].appendChild(script);
  } else {
    ready();
  }

})();
