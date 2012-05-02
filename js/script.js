/*	Author:
*	
*	Amit Gharat a.k.a. codef0rmer
* 	http://amitgharat.wordpress.com/
* 
*/
var csModel = Backbone.Model.extend({});

var csCollection = Backbone.Collection.extend({
  model : csModel, 

  initialize : function () {
    this.rows = 2;
    this.cols = 5;
  }, 

  pickRandomCard : function () {
    return (this.models)[ Math.random() * this.models.length | 0 ].get('pic');
  }
});
var csc = new csCollection([{pic : 'cat.svg'}, {pic : 'camel.svg'}, {pic : 'crow.svg'}, {pic : 'dog.svg'}, {pic : 'seal.svg'}]);

var csView = Backbone.View.extend({
  el : $('body'),   

  events : {
    "click #reload" : "reloadClick"
  }, 

  initialize : function () {
    this.template = $('#cellTemplate').children();
    this.arrLocacheImage = [];
    this.click = 1;
  },

  render : function () {
    var index = 0;
    this.arrCacheImage = [];

    $(this.el).find('#cards').empty();
    for (var row = 1; row <= csc.rows; row++) {
      var $tableRow = $('<div />').addClass('row');
      for (var col = 1; col <= csc.cols; col++) {
        if (this.arrLocacheImage.length === 0) {
          var image = csc.pickRandomCard();          
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
    this.view = new csView({});
    locache.flush();
    window.location.href = window.location.href.substring(0, window.location.href.indexOf('#')) + '#1';
  }, 

  reload : function (t) {
    this.view.click = t;
    this.view.reload(t);
  }
});

/* Boot the Application */
$(function () {
  new csRouter();
  Backbone.history.start();
});
