// import * as d3 from "https://cdn.skypack.dev/d3@7";

// const Bar3d = (config) => {
//     const { svg, x = 0, y = 0, width, height, depth } = config;

//     var faces = [];
//     faces = getFaces()

//     faces.forEach((points, name) => {
//         var path = svg.selectAll(`.face.${name}`).data([name]);
//         path.exit().remove();
//         path.enter().append('path')
//             .attr('class', `face.${name}`);

//         d3.transition(path)
//             .attr('d', points);
//     });

//     const getFaces = () => {
//         var left = x;
//         var right = left + width;
//         var top = y;
//         var bot = top + height;

//         var faces = {};

//         faces.front = [
//             [left, top],
//             [left, bot],
//             [right, bot],
//             [right, top]
//         ]

//         faces.top = [
//             [left, top],
//             [right, top],
//             [right + depth, top + depth],
//             [left + depth, top + depth],
//         ]

//         faces.right = [
//             [right, top],
//             [right + depth, top + depth],
//             [right + depth, bot + depth],
//             [right, bot],
//         ]

//         console.log(faces);
//         return faces;
//     }
// }

// export default Bar3d;