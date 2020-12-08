const express = require('express')
const app = express()
require('dotenv').config();
const { Pool, Client } = require('pg')
const path = require('path')
app.use(express.static(path.join(__dirname, 'build')));


app.use((req,res,next)=>{
   next()
})

app.get("/api",(req,res)=>{
    const pool = new Pool()
    pool.query('SELECT "NDB_No","Shrt_Desc","Energ_Kcal" as kcal,"Protein_(g)" as Protein,"Carbohydrt_(g)" as carbs,"FA_Sat_(g)" as fat_sat ,"FA_Mono_(g)" as fat_mono,"FA_Poly_(g)" as fat_poly FROM food WHERE "NDB_No" BETWEEN 1000 AND 2000',(err,re)=>{
        if(err){ res.send(err)
        }
        else{
        res.send(re.rows)
        }
        pool.end()

    })
})

app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})

app.listen(3000)