/*! terminal.js v2.0 | (c) 2014 Erik Österberg | https://github.com/eosterberg/terminaljs */

module.exports = (function () {
	var PROMPT_INPUT = 1, PROMPT_PASSWORD = 2, PROMPT_CONFIRM = 3

	var firstPrompt = true;
	function promptInput(terminalObj, message, PROMPT_TYPE, callback) {
		var isScrolledToBottom = terminalObj.isScrolledToBottom();

		var shouldDisplayInput = (PROMPT_TYPE === PROMPT_INPUT)
		var inputField = document.createElement('input')

		inputField.style.position = 'absolute'
		inputField.style.zIndex = '-100'
		inputField.style.outline = 'none'
		inputField.style.border = 'none'
		inputField.style.opacity = '0'
		terminalObj._inputLine.style.fontSize = '12px'
		terminalObj._input.style.padding = '2px';

		terminalObj._inputLine.textContent = ''
		terminalObj._input.style.display = 'block'

		message = message || '> '
		terminalObj._inputLinePrefix.textContent = message;

		terminalObj.html.appendChild(inputField)

		if(isScrolledToBottom){
			terminalObj.html.scrollTop = (terminalObj.html.scrollHeight - terminalObj.html.offsetHeight);
		}

		// if (message.length) terminalObj.print(PROMPT_TYPE === PROMPT_CONFIRM ? message + ' (y/n)' : message)

		inputField.onblur = function () {
			terminalObj._cursor.style.opacity = '0.25';
		}

		inputField.onfocus = function () {
			inputField.value = terminalObj._inputLine.textContent
			terminalObj._cursor.style.display = 'inline'
			terminalObj._cursor.style.opacity = '1';
		}

		terminalObj.html.onclick = function () {
			inputField.focus()
		}

		inputField.onkeydown = function (e) {
			if (e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40 || e.which === 9) {
				e.preventDefault()
			} else if (shouldDisplayInput && e.which !== 13) {
				setTimeout(function () {
					terminalObj._inputLine.textContent = inputField.value
				}, 1)
			}
		}
		inputField.onkeyup = function (e) {
			if (PROMPT_TYPE === PROMPT_CONFIRM || e.which === 13) {
				terminalObj._input.style.display = 'none'
				var inputValue = inputField.value
				if (shouldDisplayInput) terminalObj.print('> '+inputValue)
				terminalObj.html.removeChild(inputField)
				if (typeof(callback) === 'function') {
					if (PROMPT_TYPE === PROMPT_CONFIRM) {
						callback(inputValue.toUpperCase()[0] === 'Y' ? true : false)
					} else callback(inputValue)
				}
			}
		}
		if (firstPrompt) {
			firstPrompt = false
			setTimeout(function () { inputField.focus()	}, 50)
		} else {
			inputField.focus()
		}
	}

	var terminalBeep

	var TerminalConstructor = function (id) {
		if (!terminalBeep) {
			terminalBeep = document.createElement('audio')
			var source = '<source src="http://www.erikosterberg.com/terminaljs/beep.'
			terminalBeep.innerHTML = source + 'mp3" type="audio/mpeg">' + source + 'ogg" type="audio/ogg">'
			terminalBeep.volume = 0.05
		}

		this.html = document.createElement('div')
		this.html.className = 'Terminal'
		if (typeof(id) === 'string') { this.html.id = id }

		this._innerWindow = document.createElement('div')
		this._output = document.createElement('p')
		this._inputLinePrefix = document.createElement('span');
		this._inputLine = document.createElement('span') //the span element where the users input is put
		this._cursor = document.createElement('span')
		this._input = document.createElement('p') //the full element administering the user input, including cursor

		this._shouldBlinkCursor = true

		this.beep = function () {
			terminalBeep.load()
			terminalBeep.play()
		}

		this.print = function (message) {
			var isScrolledToBottom = this.isScrolledToBottom();

			var newLine = document.createElement('div')
			newLine.textContent = message
			newLine.style.padding = '2px';
			this._output.appendChild(newLine)

			if(isScrolledToBottom){
				this.html.scrollTop = (this.html.scrollHeight - this.html.offsetHeight);
			}
		}

		this.printError = function (message) {
			var isScrolledToBottom = this.isScrolledToBottom();

			var newLine = document.createElement('div')
			newLine.textContent = message
			newLine.style.padding = '2px';
			newLine.style.color = 'red'
			this._output.appendChild(newLine)

			if(isScrolledToBottom){
				this.html.scrollTop = (this.html.scrollHeight - this.html.offsetHeight);
			}
		}

		this.isScrolledToBottom = function () {
			return this.html.scrollTop >= (this.html.scrollHeight - this.html.offsetHeight);
		}

		this.input = function (message, callback) {
			promptInput(this, message, PROMPT_INPUT, callback)
		}

		this.password = function (message, callback) {
			promptInput(this, message, PROMPT_PASSWORD, callback)
		}

		this.confirm = function (message, callback) {
			promptInput(this, message, PROMPT_CONFIRM, callback)
		}

		this.clear = function () {
			this._output.innerHTML = ''
		}

		this.sleep = function (milliseconds, callback) {
			setTimeout(callback, milliseconds)
		}

		this.setTextSize = function (size) {
			this._output.style.fontSize = size
			this._input.style.fontSize = size
		}

		this.setTextColor = function (col) {
			this.html.style.color = col
			this._cursor.style.background = col
		}

		this.setBackgroundColor = function (col) {
			this.html.style.background = col
		}

		this.setWidth = function (width) {
			this.html.style.width = width
		}

		this.setHeight = function (height) {
			this.html.style.height = height
		}

		this.blinkingCursor = function (bool) {
			bool = bool.toString().toUpperCase()
			this._shouldBlinkCursor = (bool === 'TRUE' || bool === '1' || bool === 'YES')
		}

		this._input.appendChild(this._inputLinePrefix)
		this._input.appendChild(this._inputLine)
		this._input.appendChild(this._cursor)
		this._innerWindow.appendChild(this._output)
		this._innerWindow.appendChild(this._input)
		this.html.appendChild(this._innerWindow)

		this.html.style.position = 'absolute'
		this.html.style.top = '0'
		this.html.style.bottom = '100%'
		this.html.style.overflow = 'auto'

		this.setBackgroundColor('black')
		this.setTextColor('white')
		this.setTextSize('12px')
		this.setWidth('100%')
		this.setHeight('100%')

		this.html.style.fontFamily = 'Monaco, Courier'
		this.html.style.margin = '0'
		this._innerWindow.style.padding = '10px'
		this._input.style.margin = '0'
		this._output.style.margin = '0'
		this._cursor.style.background = 'white'
		this._cursor.innerHTML = 'C' //put something in the cursor..
		this._cursor.style.display = 'none' //then hide it
		this._input.style.display = 'none'
	}

	return TerminalConstructor
}())