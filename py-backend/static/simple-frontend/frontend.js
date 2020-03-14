let api = "localhost:5000/";
let socket = io();
let calcs_list = [];
let math_regex = /^\s*([-+]?[0-9]*\.?[0-9]+)\s*(\+|\-|\*|\/)\s*([-+]?[0-9]*\.?[0-9]+)\s*$/

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