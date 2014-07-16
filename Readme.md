#Dynamic Inset Javascript Renderer
##Client-Side Rendering Application

This repository illustrates the functionality of using dynamic insets and client-side rendering.

###Example
[http://dynamic-inset-renderer.herokuapp.com](http://dynamic-inset-renderer.herokuapp.com)


###Usage
To use a dynamic inset, construct the appropriate script tag and place it in any html page.
```html
<script data-inset-url="//dynamic-inset-assets.herokuapp.com/data/inset.json" src="http://dynamic-inset-assets.herokuapp.com/javascripts/embed.js" class="js-embed" ></script>
```
The client-side dynamic inset renderer is used by placing a simple script tag in a standard html page, with 3 attributes:
1. data-inset-url specifies where the remote inset.json file is located
1. src points to the inset rendering javascript file
1. class="js-embed" is used to help identify insets to be processed

On page-load, with these three attributes, the inset embed script runs.

###Embed script
The embed script referenced in the above script tag runs immediately, requests a new remote script and injects it into the head of the current document.
If multiple instances of the script tag are used on the smae page, only one copy of the remote script is fetched and used.

```javascript
(function(){
  if(document.getElementsByClassName('js-embed-enabled').length === 0){
    var script = document.createElement('script');
    script.setAttribute('src','//dynamic-inset-renderer.herokuapp.com/release/js/script.js');
    script.setAttribute('type','text/javascript');
    script.setAttribute('async', 'true');
    document.getElementsByTagName('head')[0].appendChild(script).classList.add("js-embed-enabled");
  }
})();
```

Once the remote script is loaded, each script tag on the page with a data-inset-url attribute is processed.

###Initial html example
```html
<!DOCTYPE html>
<html>
  <head>
    <title>js-embed-app</title>
  </head>
  <body>
    <script data-inset-url="//dynamic-inset-assets.herokuapp.com/data/inset.json" src="//dynamic-inset-renderer.herokuapp.com/release/js/embed.js" class="js-embed" ></script>
  </body>
</html>
```

###Rendered inset example
The data-inset-url attribute is read, the remote referenced asset is requested, and assuming it conforms to the inset.json spec, it is rendered around the instantiating script tag.
```html
<html>
  <head>
    <title>js-embed-app</title>
    <script src="//dynamic-inset-renderer.herokuapp.com/release/js/script.js" type="text/javascript" class="js-embed-enabled"></script>
    <script src="//code.jquery.com/jquery-latest.min.js" type="text/javascript" class="jquery-enabled"></script>
  </head>
  <body>
    <div id="inset0">
      <script data-inset-url="//dynamic-inset-assets.herokuapp.com/data/inset.json" src="//dynamic-inset-renderer.herokuapp.com/release/js/embed.js" class="js-embed" ></script>
      <h1>First Inset</h1>
      <p>The content of this inset is from a json file. and the template is from a mustache file.</p>
      <ul>
        <li>dog</li>
        <li>cat</li>
        <li>goat</li>
      </ul>
    </div>
  </body>
</html>
```
