/*	Author:
 *	
 *	Amit Gharat a.k.a. codef0rmer
 * 	http://amitgharat.wordpress.com/
 * 
 */
var csCollection = Backbone.Collection.extend({
	
});

var csModel = Backbone.Model.extend({
	defaults : {
		arrImage 	: ['cat.svg', 'camel.svg', 'crow.svg', 'dog.svg', 'seal.svg'], 
		rows 		: 2, 
		cols		: 5
	}, 
  
  pickRandomCard : function () {
    return this.get('arrImage')[ Math.random() * this.get('arrImage').length | 0 ];
  }	
});

var csView = Backbone.View.extend({
	el : $('body'),   
  
  events : {
    "click #reload" : "reloadClick"
  }, 
  
  initialize : function () {
    this.template = $('#cellTemplate').children();
    this.arrCacheImage = []; 
    this.arrLocacheImage = [];
    this.click = 1;
	},
  
  render : function () {
    var index = 0;
    this.arrCacheImage = [];
    $(this.el).find('#cards').empty();
    for (var row = 1; row <= this.model.get('rows'); row++) {
      var $tableRow = $('<div />').addClass('row');
      for (var col = 1; col <= this.model.get('cols'); col++) {
        if (this.arrLocacheImage.length === 0) {
          var image = this.model.pickRandomCard();          
        } else {
          var image = this.arrLocacheImage[index];
        }
        this.arrCacheImage.push(image);
        $tableRow.append(this.template.clone().find('img').attr('src', './img/' + image).end());
        index++;
      }   
      $(this.el).find('#cards').append($tableRow);
    }
  }, 
  
  reloadClick : function () {
    this.click++;
    window.location.href = window.location.href.substring(0, window.location.href.indexOf('#')) + '#' + this.click;
  },
  
  reload : function (locacheKey) {
    if (locache.get(locacheKey) === null) {
      this.arrLocacheImage = [];
      this.render();
      locache.set(locacheKey, this.arrCacheImage);
    } else {
      this.arrLocacheImage = locache.get(locacheKey);
      this.render();
    }
  }
});

var csRouter = Backbone.Router.extend({
  routes : {
    ':timestamp' : 'reload'
  }, 
  
  initialize : function () {
    this.view = new csView({ model : new csModel() });
    window.location.href = window.location.href.substring(0, window.location.href.indexOf('#')) + '#1';
  }, 
  
  reload : function (t) {
    this.view.reload(t);
  }
});

/* Boot the Application */
$(function () {
    new csRouter();
    Backbone.history.start();
});
