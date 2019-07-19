const fs = require("fs");

let file = fs.readFileSync("../assets/icon.svg", "utf-8");

/**
 * 
 * @param {number} max_size 
 */
function build_triangle(max_size) {
    const start = { x: Math.random() * 32, y: Math.random() * 32 };
    const middle = { x: (Math.random() - 0.5) * max_size, y: (Math.random() - 0.5) * max_size };
    const end = { x: (Math.random() - 0.5) * max_size, y: (Math.random() - 0.5) * max_size };

    return `M ${start.x} ${start.y} l ${middle.x} ${middle.y} l ${end.x} ${end.y}`;
}

/**
 * 
 * @param {number} count 
 * @param {number} max_size 
 */
function build_triangles(count, max_size) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(build_triangle(max_size));
    }

    return result;
}

while (file.includes("INPUT_HERE")) {
    file = file.replace("INPUT_HERE", build_triangles(Math.floor(Math.random() * 500), 6).join(" "));
}

fs.writeFileSync("../assets/icon-finished.svg", file);