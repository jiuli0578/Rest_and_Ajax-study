const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const STU_ARR = [
    {id:"1", name:"孙悟空", age:18, gender:"男", address:"花果山"},
    {id:"2", name:"猪八戒", age:28, gender:"男", address:"高老庄"},
    {id:"3", name:"沙和尚", age:38, gender:"男", address:"流沙河"},
]

app.use((req,res,next) => {
    //设置响应头
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,")
    res.setHeader("Access-Control-Allow-Headers","Content-type,Authorization")
    /* 
        Access-Control-Allow-Origin     允许的请求路径，设置指定值时，只能设置一个
        Access-Control-Allow-Methods    允许的请求方式
        Access-Control-Allow-Headers    允许传递的请求头
    */
    next()
})


app.use(express.urlencoded({extended:true}))
//添加解析JSON请求体的中间件
app.use(express.json())
//定义登录路由
app.post("/login",(req,res) => {
    const {username,password} = req.body
    if(username === "admin" && password === "123123"){
        // 登陆成功，生成token
        const token = jwt.sign({
            id:"123123",
            username:"admin",
            nickname:"超级管理员"
        },"chaojianquanmima",{
            expiresIn:"1h"
        })
        res.send({
            status:"ok",
            data:{
                token,
                nickname:"超级管理员"
            }
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"用户名或密码错误"
        })
    }
})

//定义学生信息路由
app.get("/students",(req,res) => {
    
    // 对token进行解码
    try{//必须在用户登录后才能访问，需要检查用户是否登录
        console.log("get请求已收到");
        // 读取请求头
        const token = req.get("Authorization").split(" ")[1]
        const decodeToken = jwt.verify(token,"chaojianquanmima")
        res.send({
            status:"ok",
            data:STU_ARR
        })
    }catch(e){
        res.status(403).send({
            status:"error",
            data:"token无效"
        })
    }
})

//查询某个学生路由
app.get("/students/:id",(req,res) => {
    console.log("查询get请求已收到");
    const id = req.params.id
    const stu = STU_ARR.find(item => item.id === id)
    if(stu){
        res.send({
            status:"ok",
            data:stu
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"查无此人"
        })
    }
    
})

//添加学生路由
app.post("/students",(req,res) => {
    console.log("添加post请求已收到");
    //获取学生信息
    const {name, age, gender, address} = req.body
    //创建学生信息
    const stu = {
        id:+STU_ARR.at(-1).id + 1 + "",
        name,
        age:+age,
        gender,
        address
    }
    //将学生信息添加到数组中
    STU_ARR.push(stu)
    //添加成功
    res.send({
        status:"ok",
        result:stu
    })
})

//删除学生的路由
app.delete("/students/:id",(req,res) => {
    console.log("删除delete请求已收到");
    const id = req.params.id
    for(let i = 0; i < STU_ARR.length; i++){
        if(STU_ARR[i].id === id){
            const delStu = STU_ARR[i]
            STU_ARR.splice(i,1)
            res.send({
                status:"ok",
                data:delStu
            })
            return
        }
    }
    res.status(403).send({
        status:"error",
        data:"查无此人"
    })
    // const delStu = STU_ARR.filter(item => item.id === id)
    // if(delStu){
    //     res.send({
    //         status:"ok",
    //         data:delStu
    //     })
    // }else{
    //     res.status(403).send({
    //         status:"error",
    //         data:"查无此人"
    //     })
    // }
})

//修改学生的路由
app.put("/students",(req,res) => {
    console.log("修改put请求已收到");
    const {id, name, age, gender, address} = req.body
    const updateStu = STU_ARR.find(item => item.id === id)
    if(updateStu){
        updateStu.name = name
        updateStu.age = age
        updateStu.gender = gender
        updateStu.address = address
        res.send({
            status:"ok",
            data:updateStu
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"查无此人"
        })
    }
})

app.get("/test",(req,res) => {
    
})
app.listen(3000,() => {
    console.log("服务器启动成功！");
})