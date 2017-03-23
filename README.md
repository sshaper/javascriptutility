# JavaScript-Utility-File
This is a utility file I created that handles some of the common JavaScript functions.  Many similar are out there this one is just custom for me.

## Util.getEl (CSS selector text)
This method takes a string that will get and element or elements based upon a CSS selector.  For example to get an element by id you would write Util.getEl('#idvalue').  To get a class you would write Util.getEl('.classValue').  NOTE: This will return a node list of element even if there is just one.

## Util.addLis(element, event, function)
This method adds an event listener to an element.  The arguments are as follows.

* element = The element you are attaching the event to (string).
* event = The event you are assigning ('click','change','mouseover', etc) (string).
* function = The function that is to run when the event is fired (function).

## Util.sendRequest(url, callback, postData, file)
This method will send text and or a file to the server via AJAX.  The arguments are as follows.

* url - The path to the file you are sending informaiton to or getting information from. If you are only getting information from the server and not sending any then you just need the url argument and callback.

* callback  -  The function that will be called when the transaction is done. "res" will the response object and "res.responseText" is the text that will be sent back from the server (see examples).

* postData (optional) - The data that you would be sending to the server (it can be stringified JSON as well).  This is only needed if you are sending data (post request) to the server.  NOTE The backend script will get to get the variable "data".  For example in PHP it would be "$_POST['data']".

* file (optional) - This is a boolean that will be set to true if you are attaching a file, otherwise omit it.

Example using just url and callback Util.sendRequest(url, callback).

```javascript
Util.sendRequest(somefile.php, function(res){
	console.log(res.responseText)
});
```



