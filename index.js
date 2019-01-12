const express = require('express')
const app = express()
const port = 3000
const exec = require('child_process').exec;
const fs = require('fs')

var bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {

    res.render('add',{stdout : " "});
    
})

app.post('/', function(req, res){
    var title = req.body.title;
    try{
        exec(`${title}`, (e, stdout, stderr)=> {
            if (e instanceof Error) {
                console.error(e);
                res.redirect('/');
                // throw e;
            }else{
                console.log('stdout ', stdout);
                console.log('stderr ', stderr);
                fs.appendFile('/tmp/order.txt', stdout, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    
                    });
                res.render('add',{stdout});
            }
        });
    } catch(err){
        console.error(err);
    }  
});

app.get('/history',(req, res) => {
    fs.readFile('/tmp/order.txt', 'utf8',(err, data) => {
        if (err) throw err;
        console.log(data);
        console.log(typeof data)
        res.send(`<form action = "/" method = "get">
        <button type="submit" name="upvote" value="back"/>
    <form><pre> ${data}</pre>`)
      });

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))