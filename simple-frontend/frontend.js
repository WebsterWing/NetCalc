let api = "localhost:5000/";
let socket = io(api, {origins : "localhost"});

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

render_calc_list([
    "Placeholder 1",
    "Placeholder 2",
    "Placeholder 3"
]);

socket.on('calc', (data) => {
    console.log(data);
});