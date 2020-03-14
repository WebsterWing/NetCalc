let api = "localhost:5000/";
let socket = null;
let calcs_list = [];


// render the calculations list
function render_calc_list(calc_list) {
    let list = document.getElementById("prev-calcs");
    list.innerHTML = ""; // clear current items in list

    for (let str of calc_list) {
        let item = document.createElement("li");
        item.innerHTML = str;
        list.appendChild(item);
    }
}

// Returns a string representing a nubmer
function num_repr(num) {
    if (Number.isInteger(num)) {
        return  num.toString();
    } else if (!isNaN(num)) {
        return num.toFixed(3);
    } else {
        return "NaN";
    }
}

function hide_errors() {
    document.getElementById("input-error").style.display = "none";
}

function show_input_error() {
    document.getElementById("input-error").style.display = "block";
}

// Returns null or returns an array where [0] is the numeric
// result of the computation and [1] is the string representation
function calc_w_str(str) {
    let math_regex = /^\s*([-+]?[0-9]*\.?[0-9]+)\s*(\+|\-|\*|\/)\s*([0-9]*\.?[0-9]+)\s*$/
    let matches = math_regex.exec(str);
    if (matches == null || matches.length != 4) {
        return null;
    }
    let op1 = Number(matches[1]);
    let op2 = Number(matches[3]);
    let res = NaN;

    switch (matches[2]) {
        case '+':
            res =  op1 + op2;
            break;
        case '-':
            res = op1 - op2;
            break;
        case '*':
            res = op1 * op2;
            break;
        case '/':
            if (op2 == 0) {
                res = NaN; // Don't divide by 0
            } else {
                res = op1 / parseFloat(op2); // prevent integer division rounding
            }
            break;
        default: // if an error occured matching the operator
            return null;
            break;
    }

    if (isNaN(res)) {
        return null;
    }
    let str_rep = str.concat(" = ", num_repr(res))
    return [res, str_rep];
}

// Keep track of previous input to prevent calculation from being run
// many times, clogging data
let last_input = "";

function run_calculation() {
    hide_errors();
    let input = document.getElementById("calc-field").value;
    if (last_input == input) {
        return; // Short circuit if running with the same input
    }
    last_input = input // Don't rerun this calculation
    console.log("Calculating with input: " + input);
    // Early return if input is empty
    if (/^\s*$/.test(input)) { // match whitespace only input
        return;
    }

    let output = calc_w_str(input);
    if (output != null) {
        document.getElementById("output-span").innerHTML =
            num_repr(output[0]);
        fetch("/push_calc", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "new_calc" : output[1]
            })
        });
    } else {
        show_input_error();
    }
}

// Events to register upon loading


hide_errors();

// Trigger calculation if button is clicked
document.getElementById("calc-button").onclick = run_calculation;

// Trigger calculation if enter key is pressed
document.getElementById("calc-field").onkeypress =  (e) => {
    if (e.keyCode == 13 || e.which == 13) {
        run_calculation();
    } else {
        has_changed = true;
    }
};

window.onload(() => {
    socket = io();
    socket.on('init_list', (data) => {
        render_calc_list(data);
        calcs_list = data;
        console.log(data);
    });

    socket.on('new_calc', (calc) => {
        calcs_list.unshift(calc.new_calc);
        calcs_list = calcs_list.slice(0,9);
        render_calc_list(calcs_list);
        console.log(calc);
    });
});