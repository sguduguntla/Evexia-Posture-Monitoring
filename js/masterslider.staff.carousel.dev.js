/**
 *	Master Slider, Staff Carousel v1.0
 * 	@author: Averta Ltd.
 */

;(function(){
	
	window.MSStfFadeView = function(options){
		MSWaveView.call(this , options);
		this.$element.removeClass('ms-wave-view').addClass('ms-stf-view');
	};
	
	MSStfFadeView.extend(MSWaveView);
	
	var p = MSStfFadeView.prototype;
	var _super = MSStfFadeView.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.__updateSlidesHoriz = function(slide , distance){
		var value =  Math.abs(distance * 0.1 / this.__width);
		value = 1 - Math.min(value , 0.1);
		slide.$element.css('opacity' , value);
	};
	
	p.__updateSlidesVertic = function(slide , distance){
		this.__updateSlidesHoriz(slide , distance);
	};
	
	MSSlideController.registerView('stffade' , MSStfFadeView);
	
})();

;(function(){
	
	window.MSStfView = function(options){
		MSWaveView.call(this , options);
		this.$element.removeClass('ms-wave-view').addClass('ms-stf-view');
		this.options.centerSpace = this.options.centerSpace  || 1;
	};
	
	MSStfView.extend(MSWaveView);
	MSStfView._3dreq = true;
	MSStfView._fallback = MSStfFadeView;
	
	var p = MSStfView.prototype;
	var _super = MSStfView.prototype;
	
	/*-------------- METHODS --------------*/
	
	p.__calcview = function(z , w){
		var a =  w / 2 * z / (z + 2000); 
		return a * (z + 2000) / 2000;
	};
	
	p.__updateSlidesHoriz = function(slide , distance){
		var value =  Math.abs(distance * 100 / this.__width);
		value = -Math.min(value , 100)* 15;
		slide.$element.css(window._csspfx + 'transform' , 'translateZ('+ value  +'px) rotateY(0.01deg) translateX('+ (distance < 0 ? 1 : -1) * (-this.__calcview(value, this.__width) * this.options.centerSpace )+'px)');
	};
	
	p.__updateSlidesVertic = function(slide , distance){
		this.__updateSlidesHoriz(slide , distance);
	};
	
	MSSlideController.registerView('stf' , MSStfView);
	
})();
