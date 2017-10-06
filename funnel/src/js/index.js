import { merge } from 'lodash';
import D3Funnel from 'd3-funnel';

// const settings = {
//   curved: {
//     chart: {
//       curve: {
//         enabled: true,
//       },
//     },
//   },
//   pinched: {
//     chart: {
//       bottomPinch: 1,
//     },
//   },
//   gradient: {
//     block: {
//       fill: {
//         type: 'gradient',
//       },
//     },
//   },
//   inverted: {
//     chart: {
//       inverted: true,
//     },
//   },
//   hover: {
//     block: {
//       highlight: true,
//     },
//   },
//   tooltip: {
//     tooltip: {
//       enabled: true,
//     },
//   },
//   click: {
//     events: {
//       click: {
//         block(d) {
//           alert(d.label.raw);
//         },
//       },
//     },
//   },
//   dynamicHeight: {
//     block: {
//       dynamicHeight: true,
//     },
//   },
//   barOverlay: {
//     block: {
//       barOverlay: true,
//     },
//   },
//   animation: {
//     chart: {
//       animate: 200,
//     },
//   },
//   label: {
//     label: {
//       fontFamily: '"Reem Kufi", sans-serif',
//       fontSize: '16px',
//     },
//   },
// };

const chart = new D3Funnel('#funnel');
const color = document.querySelector('[value="color"]');

function draw() {
  let data = [
    { label: 'Applicants', value: 12000 },
    { label: 'Pre-screened', value: 4000 },
    { label: 'Interviewed', value: 2500 },
    { label: 'Hired', value: 1500 },
  ];

  let options = {
    chart: {
      bottomWidth: 3 / 8,
      // bottomPinch: 1,
    },
    block: {
      minHeight: 25,
      dynamicHeight: true,
      // barOverlay: true,
    },
    label: {
      format: '{l}\n${f}',
    },
  };

  chart.draw(data, options);
}

draw();