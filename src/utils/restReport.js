import axios from 'axios';
import {history} from 'umi';
import {baseURL} from './reportBaseUrl'

// console.log(BASE_PATH)
const baseHeader = {
    'Content-Type': 'application/json',
};

const service = axios.create({
    timeout: 7000, // 请求超时时间
    baseURL,
    headers: baseHeader,
    withCredentials:true
})

function get(url, params){    
    return new Promise((resolve, reject) =>{        
        service.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});
}

function postJSON(url, params,header,responseType){    
    return new Promise((resolve, reject) =>{        
        service.post(url,params,{
            headers: {
                'Content-Type': 'application/json',
                ...header
            },
            responseType
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});
}

function post(url, params){    
    return new Promise((resolve, reject) =>{        
        service.post(url,params).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    })    
});
}

// 上传文件用
function postMultipart(url, data, options={},header){
    return service.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...header
        },
        ...options
    });
};

export default{
    get,
    post,
    postJSON,
    postMultipart
}
