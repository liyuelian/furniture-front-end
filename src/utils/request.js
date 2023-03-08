//引入axios包
import axios from "axios";
//通过axios创建request对象,用于发送请求到后端
const request = axios.create({
    timeout: 5000
})

//request拦截器的处理，它可以对请求做统一的处理
//1.可以对请求做统一的处理
//2.比如统一地加入token,Content-Type
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config;
}, error => {
    return Promise.reject(error)
})

//response拦截器,可以在调用接口响应后，统一的处理返回结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        //如果返回的是文件
        if (response.config.responseType === 'blob') {
            return res;
        }
        //如果返回的是string，就转成json对象
        if (typeof res === 'string') {
            //如果不为空，就转成json对象
            res = res ? JSON.parse(res) : res;
        }
        return res;
    }, error => {
        //如果失败
        console.log("err=", error);
        return Promise.reject(error);
    })

//导出request对象，在其他文件引入即可使用
export default request;