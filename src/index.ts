const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req: any, res: any) {
  res.json('Hello World')
})

app.listen(port, () => {
    console.log(`example app is listening on port ${port}`)
})

