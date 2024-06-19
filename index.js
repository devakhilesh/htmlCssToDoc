const express = require('express');
const bodyParser = require('body-parser');
const htmlToDocx = require('html-to-docx');

const path = require('path');


const app = express();
app.use(bodyParser.json());

exports.htmlCssToDocx = async (req, res) => {
    try {
      const { html, cssStyles } = req.body;
  
      if (!html || !cssStyles) {
        return res.status(400).send('HTML code and CSS styles are required.');
      }
  
      // Combine HTML and CSS into a single string
      const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>${cssStyles}</style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
  
      // Convert HTML to DOCX
      const docxBuffer = await htmlToDocx(content, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });
  
      // Send DOCX as a response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.docx"');
      res.send(docxBuffer);
    } catch (err) {
      console.error('Error generating DOCX:', err);
      res.status(500).send('Error generating DOCX');
    }
  };

app.get("/htmlToDoc", async (req, res)=>{
    try{
res.sendFile(path.join(__dirname, "./index.html"))

    }catch (err) {
        res.status(500).send({status:false, message:err.message});
    }
})

// Set up the express route
app.post('/convert', exports.htmlCssToDocx);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
