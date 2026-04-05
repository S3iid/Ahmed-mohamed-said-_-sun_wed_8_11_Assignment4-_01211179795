import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());
app.post('/users',(req,res)=>{

let data =fs.readFileSync('data.json');
let users = JSON.parse(data);
let {name,age,email} = req.body;  

let existeduser = users.find(user => user.email === email);
if(existeduser){
    return res.status(400).json({message:'User with this email already exists'});
}
else{
users.push({id:users.length+1,name,age,email});
fs.writeFileSync('data.json',JSON.stringify(users));
res.status(201).json({message:'User created successfully',user:{id:users.length,name,age,email}});
}
})
app.patch('/users/:id',(req,res)=>{
let {id} = req.params;
let data =fs.readFileSync('data.json');
let users = JSON.parse(data);
let userfind = users.find(user => user.id == id);
if(!userfind){
return res.status(404).json({message:'User not found'});

}
else
{
let {name,age,email} = req.body;
userfind.name = name  || userfind.name ;
userfind.age = age  || userfind.age ;
userfind.email = email  || userfind.email ;
fs.writeFileSync('data.json',JSON.stringify(users));
res.status(200).json({message:'User updated successfully',user:userfind});
}



})
app.delete('/users/:id',(req,res)=>{
let {id} =req.params;
let data =fs.readFileSync('data.json');
let users = JSON.parse(data);
let userfindindex=findindex(user=>user.id == id);   
if(userfindindex == -1){
    return res.status(404).json({message:'User not found'});
}
else{

users.splice(userfindindex,1);
fs.writeFileSync('data.json',JSON.stringify(users));
res.status(200).json({message:'User deleted successfully'});
}


})
app.get('/users-by-name',(req,res)=>{

let data =fs.readFileSync('data.json');
let users = JSON.parse(data);
let {name} = req.query;
let filterUserByName=users.find(user => user.name.toLowerCase() == name.toLowerCase());
if(!filterUserByName){
    return res.status(404).json({message:'User not found'});
}

else{
res.status(200).json(filterUserByName);
}
})
app.get('/users',(req,res)=>{
res.status(200).json(JSON.parse(fs.readFileSync('data.json')));
});
app.get('/users-by-min-age',(req,res)=>{
let data= fs.readFileSync('data.json');
let users = JSON.parse(data);
let {age} = req.query;
let agefilterByMinAge=users.filter(user => user.age >= age);
if(agefilterByMinAge.length == 0){
    return res.status(404).json({message:'No users found with the specified minimum age'});}
    else{
res.status(200).json(agefilterByMinAge);
    }   
})
app.get('/users-by-id',(req,res)=>{
let data =fs.readFileSync('data.json');
let users = JSON.parse(data);
let {id} = req.query;
let filterUserById=users.find(user => user.id == id);
if(!filterUserById){
    return res.status(404).json({message:'User not found'});
}
else{
    res.status(200).json(filterUserById);
}
})  

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}   );
