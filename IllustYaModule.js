+ function() {
	const EndPoint = "//www.irasutoya.com/feeds/posts/summary"
	var _ILY = function(){
		window._jsonpFunc = {
			length : 0
		};
	};
	_ILY.prototype.sendJSONP = function(base,params){
		return new Promise((r)=>{
			var el = document.createElement('script');
			window._jsonpFunc["callback"+window._jsonpFunc.length] = (data)=>{
				r(data);
				document.body.removeChild(el);
			}
			var retIdx = window._jsonpFunc.length++;
			var url = base;
			url += `?callback=${encodeURI(`_jsonpFunc.callback${retIdx}`)}`
			params = params || {}
			params["alt"] = "json-in-script";
			Object.keys(params).forEach((key,i)=>{
				url += "&"
				url+= key;
				url+= "=";
				url+=encodeURI(params[key]);
			})
			el.src = url;
			document.body.appendChild(el)
		})
	}
	_ILY.prototype.getIllsutById = function(id){
		return this.sendJSONP(EndPoint,{
			"start-index":id,
			"max-results":1,
		})
		.then(f=>this.feedParser(f))
		.then((feed)=>{
			return new this.Illust(feed.entry[0],id)
		})
	}

	_ILY.prototype.getRandomIllust = function(){
		return this.getIllsutById(Math.floor(Math.random()*this.maxIllust));
	}

	_ILY.prototype.init = function(){
		return this.sendJSONP(EndPoint,{
			"max-results":0
		}).then(f=>this.feedParser(f));
	}
	_ILY.prototype.feedParser = function(feed){
		feed = feed.feed;
		this.category = feed.category.map((c)=>{
			return c.term;
		})
		this.maxIllust = parseInt(feed.openSearch$totalResults.$t);
		return feed
	}
	_ILY.prototype.Illust = function(feed,id){
		this.category = feed.category.map(d=>d.term);
		this.id = id;
		this.thumbnailURL = feed.media$thumbnail.url;
		this.originalURL = this.thumbnailURL.replace('s72-c', 's800');
		this.name = feed.summary.$t;
		this.title = feed.title.$t;
	}
    window.ILYModule = function(cl) {
        var il = new _ILY;
        il.init().then(()=>{cl(il)})
    }
}()