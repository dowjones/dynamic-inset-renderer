/*! 2014-07-16 18:10:16 */
!function(){console.log("require script has executed");var a=function(){requirejs.config({paths:{jquery:"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",async:"//cdnjs.cloudflare.com/ajax/libs/async/1.22/async.min",hogan:"//cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.0/hogan"}}),require(["jquery","async","hogan"],function(){b()})},b=function(){$("script.js-embed").each(function(a,b){async.auto({get_inset:function(a){var c=$(b).attr("data-inset-url");$.getJSON($(b).attr("data-inset-url"),function(b){return console.log("get_inset done"),"OK"!=b.status?(console.log("Rendering disabled: inset status not OK."),!1):(b.origin=c,void a(null,b))})},get_inset_template:["get_inset",function(a,b){var c=b.get_inset.clientside?b.get_inset.clientside.template:b.get_inset.serverside.template;void 0!==c.template?(console.log("get_inset_template from inset.json done"),a(null,c.template)):$.get(c.url,function(b){console.log("get_inset_template done"),a(null,b)})}],get_inset_data:["get_inset",function(a,b){var c=b.get_inset.clientside?b.get_inset.clientside.data:b.get_inset.serverside.data;void 0!==c.data?(console.log("get_inset_data from inset.json done"),a(null,c.data)):$.get(c.url,function(b){console.log("get_inset_data done"),a(null,b)})}],rendered_inset:["get_inset","get_inset_template","get_inset_data",function(a,b){var c=Hogan.compile(b.get_inset_template),d=c.render(b.get_inset_data);a(null,d)}]},function(c,e){$(b).wrap("<div class=dynamicInset id=inset"+a+">").after(e.rendered_inset),e.get_inset.sharing===!1||"false"==$(b).attr("data-inset-sharing")?console.log("sharing disabled"):d("inset"+a,e.get_inset.origin)})})},c=function(){$("<link type=text/css rel=stylesheet href=//dynamic-inset-renderer.elasticbeanstalk.com/release/css/style.css>").appendTo("head")},d=function(a,b){console.log("sharing enabled"),c();var d='    <div class="share">      <ul>        <li>          <a class="insetTwitterIcon insetIcon" href="http://twitter.com/share?url=http://dynamic-inset-renderer.elasticbeanstalk.com/inset?url='+b+'">twitter</a>        </li>        <li>          <a class="insetEmbedIcon insetIcon" id=embed-'+a+">embed</a>        </li>      </ul>    </div>";$inset=$("#"+a),$inset.wrapInner("<div class=inset>"),$inset.children(".inset").after(d),$inset.find("#embed-"+a).one("click",function(a){a.preventDefault(),$this=$(this),$this.hide();var c='&lt;script data-inset-url="'+b+'" src="//dynamic-inset-renderer.elasticbeanstalk.com/release/js/embed.js" class="js-embed" &gt;&lt;/script&gt;';$("<code>"+c+"</code>").insertAfter($this)})};if(window.requirejs)a();else{var e=document.createElement("script");e.src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js",e.type="text/javascript",e.onload=function(){a()},document.getElementsByTagName("head")[0].appendChild(e)}}();