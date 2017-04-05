# JavaScript-Utility-File
This is a utility file I created that handles some of the common JavaScript operations.  There are many like it out there, this one is custom for me.

## Util.getEl(CSS selector text)
This method takes a string that will get an element or elements based upon a CSS selector.  For example to get an element by id you would write Util.getEl('#idvalue').  To get a class you would write Util.getEl('.classValue').  It is just a shortened version of "document.querySelectorAll()".

NOTE: This will return a node list of element even if there is just one.

Example getting an id
```javascript
Util.getEl('#elementid');
```
Example getting a class
```javascript
Util.getEl('.classname');
```
Example getting an element
```javascript
Util.getEl('elementname');
```

## Util.addLis(element, event, function)
This method adds an event listener to an element.  The arguments are as follows.

* element = The element you are attaching the event to (string).
* event = The event you are assigning ('click','change','mouseover', etc) (string).
* function = The function that is to run when the event is fired (function).

Example
```javascript
Util.addLis(Util.getEl('#elementid')[0], 'click', function(){...});
```

## Util.sendRequest(url, callback, postData, file)
This method will send text and or a file to the server via AJAX.  The arguments are as follows.

* url - The path to the file you are sending information to or getting information from. If you are only getting information from the server and not sending any then you just need the url argument and callback.

* callback  -  The function that will be called when the transaction is done. "res" will the response object and "res.responseText" is the text that will be sent back from the server (see examples).

* postData (optional) - The data that you would be sending to the server (it can be stringified JSON as well).  This is only needed if you are sending data (post request) to the server.  NOTE The backend script will get to get the variable "data".  For example in PHP it would be "$_POST['data']", in node (using body-parser) it would be "req.body.data".

* file (optional) - This is a boolean that will be set to true if you are attaching a file, otherwise omit it.

Example using just url and callback (get request) Util.sendRequest(url, callback).

```javascript
Util.sendRequest(somefile.php, function(res){
	console.log(res.responseText)
});
```

Example using url, callback and sending text data (post request) Util.sendRequest(url, callback, data).

```javascript
Util.sendRequest(somefile.php, function(res){
	console.log(res.responseText)
}, data);
```

Example using url, callback, sending text data and sending a file (post request with file) Util.sendRequest(url, callback, data, true).
IMPORTANT NOTE: You need to use the FormData JavaScript object if you want to send text and a file.  The example below is if you wrote 'var formData = new FormData()...'

```javascript
Util.sendRequest(somefile.php, function(res){
	console.log(res.responseText)
}, formData, true);
```

## Util.msgBox(obj)
The msgBox function displays a message box to inform the user of whatever.  It takes and object as an argument to set the heading, body and optional buttons.  The object has four properties with optional objects as well.  Colors can be hex, rgb, or words.

NOTE: On the webpage(s) you want the message box to appear you must add the following div

```html
<div id="msgbox"></div>;
```

background = background color
color = font color
text = text to be displayed
display = set to block of you want the button to show up (buttons are hidden by default)


 The sub objects and all the options are shown below (the order does not matter):

```javascript
{
	heading {background: 'green', text: 'This is the heading', color: 'black'},
	body {text: 'This is the heading'},
	leftbtn {text: 'Left Button', background: 'red', color: 'black', display: 'block'},
	rightbtn {text: 'Right Button', background: 'green', color: 'black', display: 'block'}
}

```

Below are some examples

Example of a simple msgBox with no buttons

```javascript
Util.msgBox({
	heading: {text: 'This is the heading', background: 'blue'},
	body: {text: 'This is the body text'}
})
```

Example of a simple msgBox with one button

```javascript
Util.msgBox({
	heading: {text: 'This is the heading', background: 'blue'},
	body: {text: 'This is the body text'},
	rightbtn: {text: 'Right Button', background: 'red', display: 'block'}
})
```
Example of a simple msgBox with two buttons

```javascript
Util.msgBox({
	heading: {text: 'This is the heading', background: 'blue'},
	body: {text: 'This is the body text'},
	leftbtn: {text: 'Left Button', background: 'green', display: 'block'},
	rightbtn: {text: 'Right Button', background: 'red', display: 'block'}
})
```
You must use the accompanying CSS as well.

```css
#msgbox{background: rgba(0, 0, 0, .5); position: absolute; width: 100%; height: 100%; font-family: sans-serif; display: none;}
#msgbox .box {width: 400px; border-radius: 5px; margin: 50px auto;}
#msgbox .box .heading {background: blue; color: white; border-radius: 5px 5px 0 0; font-size: 20px; padding: 5px;}
#msgbox .box .body {background: #FFF; position: relative; border-radius: 0 0 5px 5px; min-height: 100px; font-size: 16px; padding: 15px 8px 50px 8px;}
#msgbox .box .body .btns {margin: 10px 0 0 0; overflow: auto; position: absolute; right: 5px; bottom: 5px;}
#msgbox .box .body .btns input{float: right; padding: 6px 12px; font-size: 14px; font-weight: 400; line-height: 1.42857143; text-align: center; white-space: nowrap; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; background-image: none; border: 1px solid transparent; border-radius: 4px; background: #286090; color: #FFF; outline: none;}
#msgbox .box .body #leftbtn{margin: 0 5px 0 0;}
```

## Util.closeMsgBox()
Closes the message box that was displayed via the code above.

```javascript
Util.closeMsgBox()

```


