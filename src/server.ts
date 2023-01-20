import express from 'express'
import { main } from '.'
import {resolve} from 'path'
const app = express()


const port = 3000

app.get('/power',  (req, res) => {
     
    main({
        query:  req.query.q as string,
        start: req.query.start as string,
        onComplete: function (data: any): void { 
            res.send(data)
        }
    })
   
})

app.get('/', (req, res) => {
    res.sendFile(resolve('./index.html'))
})

 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})