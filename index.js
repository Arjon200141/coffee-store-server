const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//midlleware
app.use(cors());
app.use(express.json());


app.get('/', async(req,res)=> {
    console.log("Coffee Server is Running");
})

app.listen(port , () => {
    console.log(`Coffee Server is running on Port : ${port}`);
})