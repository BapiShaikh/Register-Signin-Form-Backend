const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const port = 2024;

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const conn = mongoose.connect("mongodb://localhost:27017/LoginRegisterDB",{useNewUrlParser:true,useUnifiedTopology:true}
)
conn.then(()=>{
    console.log("db is connected");
}).catch(e=>{
    {
        console.log(e);
    }
})

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const User = new mongoose.model("User",userSchema)

app.get("/",(req,res)=>{
    res.send("hi login")
})
app.post("/login",(req,res) =>{
    const {email, password } = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password === user.password){
                res.send({massege:"Login sucessful",user:user})
            }else{
                res.send({massege:"password did not match"})
            }

        }else{
            res.send({massege:"user not register"})
        }
    })
})

app.post("/register", async (req, res) => {
    
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.json({ message: "User already registered" });
        } else {
            const newUser = new User({
                name: name,
                email: email,
                password: password
            });

            await newUser.save();
            res.json({ message: "Registration successful Please login now" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port,()=>{
    console.log(`app lisening at ${port}`);
})