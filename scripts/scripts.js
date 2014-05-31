$(document).ready(function() {
  'use strict';

  // Variables that we might want to adjust
  var sliderNavBottomMargin = 0;
  var maxSpeed = 1000;
  var minSpeed = 500;  
  
  //Adds select boxes to the DOM and sets ID's
  function createSelectBoxesAndIds() {
    $('.slider-inner').each(function() {
      var boxId = $(this).attr('data-id');
      var slideTitle = $(this).attr('data-title');
      var slideId = boxId + '-slide';
      console.log(boxId);
      console.log(slideId);
      console.log(slideTitle);
      $(this).attr('id', slideId);
      $('.select-inner').append(
        '<div class="select-box" id="'+ boxId +'"><p>'+ slideTitle +'</p></div>');
    });
    $('.select-box').first().addClass('selected');
  }

  // Set the select box id's, text, and slide id's
  createSelectBoxesAndIds();

  // Get objects from DOM
  var sliderWrapper = $('.slider-wrapper');
  var sliderInner = $('.slider-inner');
  var selectBox = $('.select-box');
  var sliderNav = $('.slider-nav');
  var previous = $('.previous');
  var next = $('.next');
  var selectOuter = $('.select-outer');
  var selectInner = $('.select-inner');

  // Set initial values
  var activeSlide = sliderInner.first();
  var activeSlideId = activeSlide.attr('id');
  var nextSlideId;
  var selectBoxId;
  var slideIndex = 0;
  var slideTotal = sliderInner.length;
  var selectInnerWidth = selectBox.length * selectBox.outerWidth();
  selectInner.css('width', selectInnerWidth + 'px');

  // Calculate element's heights
  var selectBoxHeight = selectOuter.height();
  var sliderNavHeight = sliderNav.outerHeight();

  // Determine the position of the slides and elements based on
  // the header height, the select box outer height, and max image height;
  function positionElements() {
    // Set a maximum height for the timeline (typically to match the image height)
    var windowHeight = $(window).height();
    var timelineHeight = windowHeight;
    if (timelineHeight > 900) {
      timelineHeight = 900;
    }
    var sliderWrapperHeight = timelineHeight + selectBoxHeight;
    var selectBoxTop = timelineHeight;
    var sliderNavTop = timelineHeight - sliderNavBottomMargin - sliderNavHeight;
    
    // Set the slider, select boxes, and navigation positions
    selectOuter.css('top', selectBoxTop);
    sliderInner.css('height', timelineHeight);
    sliderNav.css('top', sliderNavTop);
    sliderWrapper.css('height', sliderWrapperHeight);
  }

  function positionTextOnSlides() {
    var windowHeight = $(window).height();
    var textContainer = $('.text-container');
    textContainer.each(function() {
      var textContainerHeight = $(this).outerHeight();
      var textContainerTop = (windowHeight - textContainerHeight)/2 - 20;
      $(this).css('margin-top', textContainerTop);
    });
  }

  // Set the selected class to the select box and set new ID's
  function setClassesAndIds() {
    selectBox.removeClass('selected');
    selectBox.eq(slideIndex).addClass('selected');
    var current = selectBox.eq(slideIndex);
    current.addClass('selected');
    scrollToSelectedBox();
    selectBoxId = current.attr('id');
    nextSlideId = selectBoxId + '-slide';
  }

  var speed = function() {
    var windowWidth = $(window).width();
    var slideSpeed = minSpeed + (maxSpeed - minSpeed)*(windowWidth/960 - 0.333333);
    if (slideSpeed < minSpeed) {
      return minSpeed;
    } else if (slideSpeed > maxSpeed) {
      return maxSpeed;
    } else {
      return slideSpeed;
    }
  }

  // Slide to next slide
  function slideNext() {
    $('#' + activeSlideId).hide('slide', { direction: 'left' }, speed());
    $('#' + nextSlideId).show('slide', { direction: 'right' }, speed());
  }

  // Slide to previous slide
  function slidePrevious() {
    $('#' + activeSlideId).hide('slide', { direction: 'right' }, speed());
    $('#' + nextSlideId).show('slide', { direction: 'left' }, speed());
  }

  // Move the selected slide's corresponding select box into the window
  // if it is out of sight 
  function scrollToSelectedBox() {
    var windowWidth = $(window).width();
    var selectedBox = $('.selected');
    var selectedOffset = selectedBox.offset().left;
    var scrollAmount, selectedIndex;
    // The scroll movement for when the select boxes are shifted to the left
    if (selectedOffset < 0) {
      selectBox.each(function() {
        if ($(this).hasClass('selected')) {
          selectedIndex = $(this).index();
        }
      });
      scrollAmount =  selectedIndex * selectBox.outerWidth();
      selectOuter.animate({scrollLeft: scrollAmount + 'px'});      
    } 
    // The scroll movement for when the select boxes are shifted to the right
    if (selectedOffset > windowWidth - selectBox.outerWidth()) {
      selectBox.each(function() {
        if ($(this).hasClass('selected')) {
          selectedIndex = $(this).index();
        }
      });
      scrollAmount =  (selectedIndex + 1) * selectBox.outerWidth() - windowWidth;
      selectOuter.animate({scrollLeft: scrollAmount + 'px'});
    }      
  }

  // Put the elements in their places
  //This is only called once on load as the text box height 
  //becomes zero once the slides get hidden
  positionTextOnSlides(); 

  positionElements();

  // If the window is resized, get the new window height, then 
  // put everything in the right position again
  $(window).resize(function() {
    positionElements();
  });

  // If orientation changes on mobile, adjust element positions to
  // the new orientation
  $( window ).on('orientationchange', function() {
    positionElements();
  });
    
  // Hide the slides, then show only the active one
  // (first slide is shown on load)
  sliderInner.hide();
  activeSlide.show();

  // Navigate to slide corresponding to the clicked select box
  selectBox.click(function() {
    var previousIndex = slideIndex;
    selectBox.removeClass('selected');
    $(this).addClass('selected');
    slideIndex = $(this).index();
    selectBoxId = $(this).attr('id');
    nextSlideId = selectBoxId + '-slide';
    if (slideIndex > previousIndex) {
      slideNext();
    } else {
      slidePrevious();
    }    
    activeSlideId = nextSlideId;    
  });
   
  function slideRight(){    
    if (slideIndex === 0) {
      slideIndex = slideTotal -1;
    } else {
      slideIndex -= 1;
    }
    setClassesAndIds();
    slidePrevious();
    activeSlideId = nextSlideId;
  }

  // Navigate to the previous slide upon clicking the previous click area
  previous.on('click', slideRight);

  // Navigate to the previous slide on swiperight event
  $('.slider-inner, .slider-nav').on('swiperight', slideRight);

  function slideLeft() {
    if (slideIndex === slideTotal - 1) {
      slideIndex = 0;
    } else {
      slideIndex += 1;
    }
    setClassesAndIds();
    slideNext();
    activeSlideId = nextSlideId;
  }

  // Navigate to the next slide upon clicking the next click area
  next.on('click', slideLeft);

  // Navigate to the next slide on swipeleft event
  $('.slider-inner, .slider-nav').on('swipeleft', slideLeft);
    
});