const express = require('express');
const app = express();
const cors = require('cors');
const host = 'localhost';
//const host = 'prometheus.gtc.edu';
const port = 12000;
const url = `http://${host}:${port}`;
const {FlightData} = require('./models/FlightData');
const tempData = JSON.parse(JSON.stringify(FlightData))

app.listen(port,()=>console.log(url));

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//APIs
app.get('/flights',(req,res)=>{
    res.json(FlightData);
});

//Reset
app.get('/flights/reset',(req,res)=>{
    FlightData.splice(0);
    FlightData.push(...tempData);
    res.json(FlightData);
});


app.get('/flights/:id',(req,res)=>{
    const id = req.params.id;
    const index = FlightData.findIndex(flight => flight.id == id);
    if(index != -1){
        res.json(FlightData[index]);
        return;
    }
    res.json([]);
});

app.delete('/flights/:id',(req,res)=>{
    const id = req.params.id;
    const index = FlightData.findIndex(flight => flight.id == id);
    if(index != -1){
        FlightData.splice(index,1);
        res.json({"status":"Flight deleted."});
        return;
    }
    res.json({"status":"Flight not found."});
});

app.delete('/flights',(req,res)=>{
    FlightData.splice(0);
    res.json({"status":"All flights deleted."});
});

app.put('/flights/:id',(req,res)=>{
    const id = req.params.id;
    const index = FlightData.findIndex(flight => flight.id == id);
    if(index != -1){
        FlightData[index] = req.body;
        res.json({"status":"Flight updated."});
        return;
    }
    res.json({"status":"Flight not found."});
});

app.post('/flights',(req,res)=>{
    let prevLength = FlightData.length;
    FlightData.push(req.body);
    if(FlightData.length > prevLength){
        res.json({"status":"New flight added."});
        return;
    }
    res.json({"status":"Flight could not be added."});
});

