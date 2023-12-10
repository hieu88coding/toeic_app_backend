const fs = require('fs');
const pdf = require('pdf-parse');
const rimraf = require("rimraf");
const pdfImages = require("./pdfImages.js")
// default render callback
function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
        .then(function (textContent) {
            let lastY, text = '';
            for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                    text += item.str;
                }
                else {
                    text += '\n' + item.str;
                }
                lastY = item.transform[5];
            }
            return text;
        });
}

let options = {
    pagerender: render_page,
    max: 1// 5 first pages
}

let dataBuffer = fs.readFileSync('./pdf/DeBai.pdf');

pdf(dataBuffer, options).then(function (data) {
    //use new format
    console.log(data.text);
});

