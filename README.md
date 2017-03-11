# Markdup
A library for programmatically displaying html markup

## Why Markdup?

Markdup was created to help display HTML markup for frontend libraries or style guides and avoid the pains of escaping HTML.

## Show Me a Demo

https://wcj3.github.io/Markdup/

## How to use 

Simply wrap your markup in a div or section element and set the following data-attributes

The key attribute are data-markdup-get & data-markdup-render

```
<section data-markdup-get="copy1">
  <div class="card">
	  <div class="card-header"> 
      Featured 
    </div>
		<div class="card-block">
		  <h4 class="card-title">Card title</h4>
			<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content</p>
		</div>
		<ul class="list-group list-group-flush">
		  <li class="list-group-item">Cras justo odio</li>
			<li class="list-group-item">Dapibus ac facilisis in</li>
			<li class="list-group-item">Vestibulum at eros</li>
		</ul>
		<div class="card-block">
		  <a href="#" class="btn btn-primary">Button</a>
			<a href="#" class="btn btn-link">Button</a>
	  </div>
  </div>
</section>
<pre class="html" data-markdup-render="copy1">
	  <code></code>
</pre>
```
