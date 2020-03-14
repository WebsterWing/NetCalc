let api = "localhost:5000/";
let socket = io();
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

// Returns null or returns an array where [0] is the numeric
// result of the computation and [1] is the string representation
function calc_w_str(str) {
    let math_regex = /^\s*([-+]?[0-9]*\.?[0-9]+)\s*(\+|\-|\*|\/)\s*([-+]?[0-9]*\.?[0-9]+)\s*$/
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
    let str_rep = str.concat(" = ", res.toFixed(3))
    return [res, str_rep];
}

function run_calculation() {
    let input = document.getElementById("calc-field").value;
    let output = calc_w_str(input);
    document.getElementById("output-span").innerHTML
}

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