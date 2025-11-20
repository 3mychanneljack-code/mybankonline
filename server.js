const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let db = {users: {mywebhosting: {password:"password123", balance:0, admin:true}}, transactions: []};

app.post('/login',(req,res)=>{
 const {username,password}=req.body;
 const u=db.users[username];
 if(!u || u.password!==password) return res.status(403).json({error:"Invalid"});
 res.json({ok:true, admin:!!u.admin, balance:u.balance});
});

app.post('/send',(req,res)=>{
 const {from,to,amount}=req.body;
 if(amount>20 || amount<=0) return res.status(400).json({error:"Limit"});
 if(!db.users[from]||!db.users[to]) return res.status(400).json({error:"User"});
 if(db.users[from].balance<amount) return res.status(400).json({error:"NoFunds"});
 db.users[from].balance-=amount;
 db.users[to].balance+=amount;
 db.transactions.push({from,to,amount,time:Date.now()});
 res.json({ok:true});
});

app.get('/admin/users',(req,res)=>{res.json(db.users);});
app.get('/',(req,res)=>res.send("MyBank API running"));
app.listen(3000);
