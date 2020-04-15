	//declaring variable for calculator
	let data = document.getElementById("data");
	let past = document.getElementById("past");
	let equals = document.getElementById("equals");
	let decimal = document.getElementById("decimal");
	let clear = document.getElementById("C");
	let clearE = document.getElementById("CE");
	let numbers = document.getElementsByClassName("number");
	let operators = document.getElementsByClassName("calc");



	//added event listeners
	clear.addEventListener("click", clickClear);
	clearE.addEventListener("click", clickBackspace);
	equals.addEventListener("click", clickEquals);
	decimal.addEventListener("click", clickDecimal);
	document.addEventListener("keydown", keydown);


	//on key press event
	function keydown(e) {
	    //alert(e.key)
	    if (!isNaN(e.key)) {
	        clickNumber(e.key.toString());
	        return;
	    }
	    switch (e.key) {
	        case "c":
	            clickClear();
	            break;
	        case "Backspace":
	            clickBackspace();
	            break;
	        case ".":
	            clickDecimal();
	            break;
	        case "Enter":
	            clickEquals();
	            break;
	        case "=":
	            clickEquals();
	            break;
	        case "+":
	            clickCalc("+");
	            break;
	        case "-":
	            clickCalc("-");
	            break;
	        case "*":
	            clickCalc("\xD7");
	            break;
	        case "/":
	            clickCalc("\xF7");
	            break;
	        case "%":
	            clickCalc("%");
	            break;
	    }
	}
	//looping thee numbers
	for (let n of numbers) {
	    n.addEventListener("click", clickNumber);
	}

	//looping thee operators
	for (let o of operators) {
	    o.addEventListener("click", clickCalc);
	}



	function clickNumber(e) {
	    let number;
	    if (typeof e === "string") {
	        number = e;
	    } else {
	        number = e.target.innerText;
	    }
	    if (isHistoryOperator(past.innerText.length - 1) && data.innerText !== "-") {
	        data.innerText = "";
	    }

	    if (equalsClicked()) {
	        past.innerText = number;
	        data.innerText = number;
	    } else if (isPastTooLong() || isDataLong()) {
	        return;
	    } else if (data.innerText === "0" || data.innerText === "-0") {
	        past.innerText = past.innerText.slice(0, past.innerText.length - 1) + number;
	        if (data.innerText === "0") {
	            data.innerText = number;
	        } else {
	            data.innerText = "-" + number;
	        }
	    } else {
	        past.innerText += number;
	        data.innerText += number;
	    }

	    clickEquals()
	}

	//for decimal values
	function clickDecimal() {
	    if (equalsClicked() || data.innerText === "") {
	        past.innerText = "0.";
	        data.innerText = "0.";
	        return;
	    }

	    if (isHistoryOperator(past.innerText.length - 1) && data.innerText !== "-") {
	        data.innerText = "";
	    }

	    if (isPastTooLong() || isDataLong() || data.innerText.includes(".")) {
	        return;
	    } else if (isHistoryOperator(past.innerText.length - 1)) {
	        past.innerText += "0.";
	        data.innerText += "0.";
	    } else if (past.innerText[past.innerText.length - 1] !== ".") {
	        past.innerText += ".";
	        data.innerText += ".";
	    }
	}

	function clickCalc(e) {
	    let calc = e;
	    if (e === "-" && (isHistoryOperator(past.innerText.length - 1) || past.innerText === "")) {

	        return;
	    }
	    if (
	        past.innerText === "" ||
	        data.innerText.search(/[a-z><]/gi) !== -1 ||
	        (isHistoryOperator(past.innerText.length - 1) && isHistoryOperator(past.innerText.length - 2))
	    ) {
	        return;
	    }
	    if (typeof e === "string") {
	        calc = e;
	    } else {
	        calc = e.target.innerText;
	    }

	    if (equalsClicked()) {
	        past.innerText = data.innerText + calc;
	    } else if (isPastTooLong()) {
	        return;
	    } else if (isHistoryOperator(past.innerText.length - 1)) {
	        past.innerText = past.innerText.slice(0, past.innerText.length - 1) + calc;
	    } else {
	        past.innerText += calc;
	    }
	}

	function clickClear() {
	    data.innerText = "0";
	    past.innerText = "0";
	}

	function clickBackspace() {
	    if (past.innerText.search(/[a-z><]/gi) !== -1) {
	        data.innerText = "=";
	        past.innerText = "0";
	        return;
	    }


	    if ((!isHistoryOperator(past.innerText.length - 1) || data.innerText === "-") && !equalsClicked()) {
	        data.innerText = data.innerText.slice(0, data.innerText.length - 1);
	    } else {
	        data.innerText = lastNoInHistory();
	    }

	    past.innerText = past.innerText.slice(0, past.innerText.length - 1);
	    if (past.innerText === "") {
	        data.innerText = "=";
	        past.innerText = "0";
	        return;
	    }
	}


	function clickEquals() {
	    if (
	        isHistoryOperator(past.innerText.length - 1) ||
	        past.innerText[past.innerText.length - 1] === "=" ||
	        past.innerText === ""
	    ) {
	        return;
	    }

	    let numbersArray = past.innerText.split(/[^0-9.]+/g).filter(i => i !== "");
	    numbersArray = numbersArray.map(i => Number(i));
	    let operatorsArray = past.innerText.split(/[0-9.]+/g).filter(op => op !== "");

	    if (past.innerText[0] === "-") {
	        numbersArray[0] = -numbersArray[0];
	        operatorsArray.shift();
	    }


	    data.innerText = "=";
	    data.innerText += evaluate(numbersArray, operatorsArray).toString();

	}


	function evaluate(numbersArray, operatorsArray) {
	    for (let i = 0; i < operatorsArray.length; i++) {
	        if (operatorsArray[i][0] === "\xF7" || operatorsArray[i][0] === "\xD7" || operatorsArray[i][0] === "%") {
	            let evaluation = simpleEval(numbersArray[i], numbersArray[i + 1], operatorsArray[i]);
	            numbersArray.splice(i, 2, evaluation);
	            operatorsArray.splice(i, 1);
	            i--;
	        }
	    }

	    for (let i = 0; i < operatorsArray.length; i++) {
	        let evaluation = simpleEval(numbersArray[i], numbersArray[i + 1], operatorsArray[i]);
	        numbersArray.splice(i, 2, evaluation);
	        operatorsArray.splice(i, 1);
	        i--;
	    }

	    return output(numbersArray[0]);

	    function simpleEval(a, b, operation) {
	        switch (operation) {
	            case "+":
	                return a + b;
	            case "-":
	                return a - b;
	            case "\xF7":
	                return a / b;
	            case "\xD7":
	                return a * b;
	            case "%":
	                return a % b;
	            case "+-":
	                return a - b;
	            case "--":
	                return a + b;
	            case "\xF7-":
	                return a / -b;
	            case "\xD7-":
	                return a * -b;
	            case "%-":
	                return a % -b;
	            default:
	                console.error("Evaluation cannot be completed");
	                return;
	        }
	    }

	    function output(n) {
	        if (Math.abs(n) < 1) {
	            return Number(n.toPrecision(8)).toString();
	        } else if (n > 9999999999 && Math.abs(n) !== Infinity) {
	            return ">9999999999";
	        } else if (n < -999999999 && Math.abs(n) !== Infinity) {
	            return "<-999999999";
	        } else if (
	            !Number(n.toPrecision(9))
	            .toString()
	            .includes(".")
	        ) {
	            return Number(n.toPrecision(10)).toString();
	        }
	        return Number(n.toPrecision(9)).toString();
	    }
	}


	function lastNoInHistory() {
	    let number = past.innerText
	        .split(/[^0-9.]+/g)
	        .filter(i => i !== "")
	        .pop();

	    if (past.innerText.endsWith("-" + number, past.innerText.length - 1)) {
	        number = "-" + number;
	    }

	    return number;
	}


	function equalsClicked() {
	    return past.innerText[past.innerText.length - 1] === "=" || past.innerText === "";
	}

	function isPastTooLong() {
	    return past.innerText.length > 20;
	}

	function isDataLong() {
	    return data.innerText.length >= 10;
	}


	function isHistoryOperator(i) {
	    return (
	        past.innerText[i] === "%" ||
	        past.innerText[i] === "+" ||
	        past.innerText[i] === "\xF7" ||
	        past.innerText[i] === "\xD7" ||
	        past.innerText[i] === "-"
	    );
	}