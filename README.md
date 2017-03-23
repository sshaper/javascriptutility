# JavaScript-Utility-File
This is a utility file I created that handles some of the common JavaScript functions.  Many similar are out there this one is just custom for me.

## Util.getEl (CSS selector text)
This method takes a string that will get and element or elements based upon a CSS selector.  For example to get an element by id you would write Util.getEl('#idvalue').  To get a class you would write Util.getEl('.classValue').  NOTE: This will return a node list of element even if there is just one.

##Util.addLis(element, event, function)
This method adds an event listener to an element.  The arguments are as follows.

* element = The element you are attaching the event to.
* event = The event you are assigning ('click','change','mouseover', etc).
* function = The function that is to run when the event is fired.

