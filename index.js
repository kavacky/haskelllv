var currentSlide = null;
var slides = null;

var summary = null;
var summaryTrigger = null;

var byId = document.getElementById.bind(document)

var slideNumber = parseInt(location.hash.slice(1)) || 1;

var hasClass = function(e, name) {
    return e.className.indexOf(name) != -1
}

var addClass = function(e, name) {
    e.className += " " + name
}
var removeClass = function(e, name) {
    e.className = e.className.replace(name,"")
}

var arrows = {
    prev: null,
    next: null
}

var disableArrows = function() {
    next = currentSlide.nextElementSibling
    prev = currentSlide.previousElementSibling

    removeClass(arrows.prev, "disabled")
    removeClass(arrows.next, "disabled")

    if (next === null) {
        addClass(arrows.next, "disabled")
    }
    if (prev === null) {
        addClass(arrows.prev, "disabled")
    }
}

var slideStep = function(dir) {
    var next = dir ? currentSlide.nextElementSibling : currentSlide.previousElementSibling
    if (next != null) {
        removeClass(currentSlide, "active")
        removeClass(currentSlide, "left")

        dir && addClass(currentSlide, "rightside")
        dir || addClass(currentSlide, "leftside")

        currentSlide = next

        dir || removeClass(currentSlide, "rightside")
        dir && removeClass(currentSlide, "leftside")

        addClass(currentSlide, "active" + (dir ? "" : " left"))

        slideNumber += dir ? 1 : -1
        location.hash = slideNumber

        disableArrows()

        byId("slidenum").innerText = slideNumber
    }
}

var prevSlide = function(){
    slideStep(false)
}

var nextSlide = function(){
    slideStep(true)
}

var displayTooltip = function(event) {
    var elem = byId("tooltip_" + this.id)
    elem.style.left = event.clientX+2
    elem.style.top = event.clientY+3
    addClass(elem, "visible")
    removeClass(elem, "hidden")
}

var hideTooltip = function() {
    var elem = byId("tooltip_" + this.id)
    addClass(elem, "hidden")
    removeClass(elem, "visible")
}

var setActive = function(num) {
    if (num) {
        slideNumber = num
    }

    for (var i = 0; i < slides.length; i++) {
        removeClass(slides[i], "active")
        removeClass(slides[i], "leftside")
        removeClass(slides[i], "rightside")
        if (i+1 < slideNumber) {
            addClass(slides[i], "rightside")
        }
        else if (i+1 > slideNumber) {
            addClass(slides[i], "leftside")
        }
    }

    addClass(slides[slideNumber-1], "active")

    currentSlide = document.getElementsByClassName("slide active")[0]

    byId("slidenum").innerText = slideNumber
}

var changeSlide = function(e) {
    var elem = e.target
    if (elem.tagName == "LI") {
        elem = elem.firstChild
    }
    if (elem.tagName == "A") {
        slideNumber = parseInt(elem.hash.slice(1))
        setActive()
        disableArrows()
        triggerSummary()
    }
}

var triggerSummary = function() {
    var active = hasClass(summaryTrigger, "active")
    if (active) {
        removeClass(summary, "visible")
        summaryTrigger.innerText = ">"
        removeClass(summaryTrigger, "active")
    }
    else {
        addClass(summary, "visible")
        summaryTrigger.innerText = "<"
        addClass(summaryTrigger, "active")
    }
}

window.onload = function() {
    arrows.prev = byId("prev")
    arrows.next = byId("next")
    arrows.prev.addEventListener("click", prevSlide, false)
    arrows.next.addEventListener("click", nextSlide, false)

    var tooltips = document.getElementsByClassName("def")
    summary = byId("summary")
    summaryTrigger = byId("trigger_summary")

    for (var i = 0; i < tooltips.length; i++) {
        var e = tooltips[i]
        e.addEventListener("mouseover", displayTooltip)
        e.addEventListener("mouseout", hideTooltip)
    }

    slides = document.getElementsByClassName("slide")

    setActive()

    disableArrows()

    summaryTrigger.addEventListener("click", triggerSummary, false)

    summary.addEventListener("click", changeSlide)
}
