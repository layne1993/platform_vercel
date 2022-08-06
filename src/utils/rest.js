import axios from 'axios';
import { getCookie, getQueryString, clearCookie } from '@/utils/utils';
import { history } from 'umi';
import qs from 'qs';

// console.log(BASE_PATH)
const baseHeader = {
    account: getCookie('account')
    // 'Content-Type': 'application/json'
};
const service = axios.create({
    headers: baseHeader
    // headers: {
    //   "Content-Type": "application/json"
    // }
});

const post = (url, data) => {
    const params = {
        ...data
    };
    return service.post(`${BASE_PATH.adminUrl}${url}`, qs.stringify(params));
};
const postYWFX = (url, data) => {
    const params = {
        ...data
    };
    return service.post(`${url}`, qs.stringify(params));
};

const postForm = (url, data) => {
    return service.post(`${BASE_PATH.adminUrl}${url}`, qs.stringify(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

const postFormNoqs = (url, data) => {
    return service.post(`${BASE_PATH.adminUrl}${url}`, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

// 上传文件用
const postMultipart = (url, data, options = {}) => {
    return service.post(`${BASE_PATH.adminUrl}${url}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ...options
    });
};

const postJSON = (url, data) => {
    let params = {
        ...data
    };
    if (!url.includes('account/findAllUser') && !url.includes('account/insertUser')) {
        params = {
            ...data
        };
    }
    return service.post(`${BASE_PATH.adminUrl}${url}`, params, {
        headers: {
            'Content-Type': 'application/json',
            account: getCookie('account'),
            tokenId: getCookie('vipAdminToken') || '' //别改
        }
    });
};
const postArray = (url, data) => {
    return service.post(`${BASE_PATH.adminUrl}${url}`, data, {
        headers: {
            'Content-Type': 'application/json',
            account: getCookie('account'),
            tokenId: getCookie('vipAdminToken') || '' //别改
        }
    });
};

const postBlob = (url, data) => {
    let params = {
        ...data
    };
    if (!url.includes('account/findAllUser') && !url.includes('account/insertUser')) {
        params = {
            ...data
        };
    }
    return axios.post(`${BASE_PATH.adminUrl}${url}`, params, {
        headers: {
            'Content-Type': 'application/json',
            account: getCookie('account'),
            tokenId: getCookie('vipAdminToken') || '' //别改
        },
        responseType: 'blob'
    }).catch((err) => console.log(err));
};

const get = (url, data, type) => {
    if (type) {
        return service.get(
            `${url}?${qs.stringify({ ...data, t: Date.now() }, { arrayFormat: 'repeat' })}`,
        );
    }
    return service.get(
        `${BASE_PATH.adminUrl}${url}?${qs.stringify(
            { ...data, t: Date.now() },
            { arrayFormat: 'repeat' },
        )}`,
    );
};

const getBlob = (url, params) => {
    return service.get(
        `${BASE_PATH.adminUrl}${url}`,
        {
            params,
            responseType: 'blob'
        }
    );
};

// put 请求
const put = (url, data) => {
    const params = {
        ...data
    };
    return service.put(`${BASE_PATH.adminUrl}${url}`, params);
};

// delete 请求
const ax_delete = (url, data) => {
    return service.delete(`${BASE_PATH.adminUrl}${url}`, { params: data });
};

// delete 请求
const ax_bd_delete = (url, data) => {
    const params = {
        ...data
    };
    // console.log(params);
    return service.delete(`${BASE_PATH.adminUrl}${url}`, {
        data,
        headers: {
            'Content-Type': 'application/json',
            account: getCookie('account'),
            tokenId: getCookie('vipAdminToken') || '' //别改
        }
    });
};


const postJSON_original = (url, data) => {
    return service.post(`${BASE_PATH.adminUrl}${url}`, data, {
        headers: {
            'Content-Type': 'application/json',
            account: getCookie('account'),
            tokenId: getCookie('vipAdminToken') || '' //别改
        }
    });
};


// deleteForm
const deleteForm = (url, data) => {
    return service.delete(`${BASE_PATH.adminUrl}${url}`, {
        params: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};


service.interceptors.request.use(
    (req) => {
        // 从这里设置请求头(headers)里的tokenId，防止缓存
        req.headers.tokenId = getCookie('vipAdminToken') || ''; //别改
        // req.headers.tokenId = 'NS15cHAtMzQzMTUwNTU1OEBxcS5jb20tMTAwMS0xNjA2Njk4NjA1MjMx';
        return req;
    },
    (err) => {
        // eslint-disable-next-line no-undef
        return Promise.reject(err);
    },
);

service.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data.code === 1014 || +data.code === 1001020010) {
            // token失效
            const secret = getQueryString('secret');

            if (secret) {
                clearCookie();
                location.reload();
            } else {
                history.push('/exception/invalid');
                return data;
            }

            // return window.location.href = `//${window.location.host}${BASE_PATH.baseUrl}user/login`;
        }

        return data;
    },
    (error) => {
        console.log(error);
        const response = {
            code: 1009,
            data: null,
            message: '请求发送失败或服务器错误',
            jsonObject: error
        };
        return response;
    },
);
const getBasicInfo = (url, data) => {
    const params = {
        ...data
    };
    return service.get(`${BASE_PATH.adminUrl}${url}`, qs.stringify(params));
};

export default {
    post,
    postJSON,
    get,
    getBlob,
    put,
    ax_delete,
    postForm,
    postFormNoqs,
    postMultipart,
    deleteForm,
    postBlob,
    postYWFX,
    ax_bd_delete,
    getBasicInfo,
    postArray,
    postJSON_original
};
