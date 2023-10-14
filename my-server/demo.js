// 引入jwt
const jwt = require("jsonwebtoken")
// 创建一个对象
const obj = {
    name:"孙悟空",
    age:18,
    gender:"男"
}
// 使用jwt来对json数据进行加密
const token = jwt.sign(obj,"hellohowareyou",{
    expiresIn:"1min"
})
try{
    // 服务器收到客户端的token后解密
    const decodeData = jwt.verify(token,"hellohowareyou")
    console.log(decodeData);
}catch(e){
    console.log("无效的token");
}
// console.log(token);