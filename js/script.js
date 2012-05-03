var App = {
	run: function() {
		locache.flush();
		this.view = new this.View();
		this.router = new this.Router();
			
		Backbone.history.start();		
		this.router.navigate("1", {trigger: true});
	}
};

App.Model = Backbone.Model.extend({});

App.Collection = Backbone.Collection.extend({
	model : App.Model,

	initialize : function (models, options) {
		options.page = options.page || 1;
		options.x = options.x || 1;
		options.y = options.y || 1;
		
		this.cardChoices = ['cat', 'camel', 'crow', 'dog', 'seal'];
		
		this.getCards(options.page, options.x, options.y);
	},
	
	// Generate a random card
	getRandCard : function () {
		return (this.cardChoices)[ Math.random() * this.cardChoices.length | 0 ];
	},
	
	// Fill the collection with the proper number of models. Get them from
	// locache if they exist
	getCards: function(page, x, y) {
			// set the number of cards needed
		var size = x*y,
			// key is a combination of page # and number of cards needed
			key = page + "-" + size;
	
		if (locache.get(key) === null) { // Key wasn't found. Create set
			while ( size-- ) {
				this.add({card: this.getRandCard()});
			}
			
			locache.set(key, this.toJSON());
		} else {
			this.add(locache.get(key));
		}
	}
});

App.View = Backbone.View.extend({
	el: 'body',
	
	events: {
		"click #reload": "reloadClick"
	},
	
	initialize: function() {
		this.template = this.$('.cell', '#cellTemplate');
		this.click = 1;
		// I put the rows and cols in the view because then you are able to use
		// the view to get rows/cols from input boxes. Rows and Cols really
		// required to be anywhere specific, but I like how this works here.
		this.rows = 2;
		this.cols = 5;
	},
	
	reloadClick: function() {
		this.click++;
		App.router.navigate("" + this.click, {trigger: true});
	},
	
	render: function(page) {
		var cards = new App.Collection(null, {
				page: page,
				x: this.cols,
				y: this.rows
			}),
			$cards = $('<div id="cards" />').addClass('table');
		
		for (var row = 0; row < this.rows; row++) {
			var $tableRow = $('<div />').addClass('row');
			
			for (var col = 0; col < this.cols; col++) {
				var card = cards.models.shift(),
					imageSrc = './img/' + card.get('card') + ".svg",
					$cell = this.template.clone();
				
				$cell.find('img').attr('src', imageSrc);
				$tableRow.append($cell);
			}
			
			$cards.append($tableRow);
		}
		this.$('#cards').replaceWith($cards);
	}
});

App.Router = Backbone.Router.extend({
	routes: {
		':page': 'loadCards'
	},
	
	loadCards: function(page) {
		App.view.render(page);
	}
});

jQuery(function() {
	App.run();
});