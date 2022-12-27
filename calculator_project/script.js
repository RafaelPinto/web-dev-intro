let clicked = null

let calcMemory = {
    firstNumber: "0",
    operator: "None",
    enteringSecondNumber: false,
    set: function (newNumber, operator) {
        this.firstNumber = newNumber;
        this.operator = operator;
    },
    clear: function () {
        this.firstNumber = "0";
        this.operator = "None";
        this.enteringSecondNumber = false;
    },
};

const functions = {
    "C": function() {
        calcMemory.clear();
        result.clear();
    },
    "←": function() {
        result.backspace();
    },
};

const equals = (operator, firstNumber, secondNumber) => {
    firstNumber = parseInt(calcMemory.firstNumber);
    secondNumber = parseInt(result.resultPointer.innerText);
    ret = operators[operator](firstNumber, secondNumber);
    result.set(ret.toString());
};

const operators = {
    "÷": function(a, b) {
        return Math.floor(a / b);
    },
    "x": function(a, b) {
        return a * b;
    },
    "-": function(a, b) {
        return a - b;
    },
    "+": function(a, b) {
        return a + b;
    },
};

const result = {
    resultPointer: document.querySelector(".result"),
    clear: function () {
        this.resultPointer.innerText = "0";
    },
    set: function (newNumber) {
        this.resultPointer.innerText = newNumber;
    },
    update: function (newDigit) {
        currentText = this.resultPointer.innerText
        if (currentText === "0" && newDigit === "0") {
            this.resultPointer.innerText = "0";
        } else {
            if (currentText === "0") {
                this.resultPointer.innerText = newDigit;
            } else {
                this.resultPointer.innerText += newDigit;
            }
        }    
    },
    backspace: function () {
        currentText = this.resultPointer.innerText;
        if (currentText.length > 1) {
            this.resultPointer.innerText = currentText.slice(0, -1);
        } else {
            this.resultPointer.innerText = "0";
        }
    }
}

const init = () => {
    document
        .querySelector(".calculator")
        .addEventListener("click", function (event) {
            clicked = event.target.innerText;
            
            if (clicked in operators) {
                calcMemory.set(result.resultPointer.innerText, clicked);
                calcMemory.enteringSecondNumber = true;
            };
            if (clicked in functions) {
                functions[clicked]();
            };
            if (clicked === "=") {
                let operator = calcMemory.operator
                firstNumber = calcMemory.firstNumber;
                secondNumber = result.resultPointer.innerText;
                equals(operator, firstNumber, secondNumber);            
            }
            if (!isNaN(parseInt(clicked))) {
                if (calcMemory.enteringSecondNumber) {
                    result.clear();
                    calcMemory.enteringSecondNumber = false;
                }
                result.update(clicked);
            };
        });
};

init()
