import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import axios from 'axios';
import qs from 'qs';
// eslint-disable-next-line no-undef
const ExportJsonExcel = require('js-export-excel');
import { message } from 'antd';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }

    return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
    // eslint-disable-next-line no-undef
    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'development') {
        return true;
    }

    return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
    const authority = router.find(
        ({ routes, path = '/', target = '_self' }) =>
            (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
            (routes && getAuthorityFromRouter(routes, pathname)),
    );
    if (authority) return authority;
    return undefined;
};
export const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach((route) => {
        // match prefix
        if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
            if (route.authority) {
                authorities = route.authority;
            } // exact match

            if (route.path === path) {
                authorities = route.authority || authorities;
            } // get children authority recursively

            if (route.routes) {
                authorities = getRouteAuthority(path, route.routes) || authorities;
            }
        }
    });
    return authorities;
};

export function getCookie(name) {
    let search = `manager_${name}=`; // 查询检索的值
    let returnvalue = ''; // 返回值
    if (document.cookie.length > 0) {
        let sd = document.cookie.indexOf(search);
        if (sd !== -1) {
            if (sd > 0) {
                search = `manager_${name}=`;
                sd = document.cookie.indexOf(search);
                if (sd === -1) {
                    return '';
                }
            }
            sd += search.length;
            let end = document.cookie.indexOf(';', sd);
            if (end === -1) end = document.cookie.length;
            returnvalue = decodeURI(document.cookie.substring(sd, end));
        }
    }
    return returnvalue;
}
export function setCookie(name, value) {
    const Days = 30; // 此 cookie 将被保存 30 天
    const exp = new Date(); // new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = `manager_${name}=${encodeURI(value)};expires=${exp.toGMTString()};path=/`;
}
export function clearCookie() {

    const keys = document.cookie.match(/[^ =;]+(?=\=)/g) || [];
    const filterKeys = [];
    keys.map((item) => {
        if (item.indexOf('manager_') !== -1) {
            filterKeys.push(item);
        }

    });
    // console.log(filterKeys)
    if (filterKeys) {
        for (let i = filterKeys.length; i >= 0; i -= 1) {
            document.cookie = `${filterKeys[i]}=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`;
        }
    }
    // 清除上级域名的建站cookie
    const {host} = location;
    const arr = host.split('.').reverse();
    document.cookie = `uniquemobile_vipWebsiteToken=''; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/;domain=.${arr[1]}.${arr[0]}`;
}

// 删除单个cookies
export function delCookie(name) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = getCookie(name);
    // alert(1)s
    if (cval != null) document.cookie = `manager_${name}=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/`;
}
export function getToken() {
    const token = getCookie('vipAdminToken');
    if (token) {
        return token;
    }
    return null;
}

// 获取资源路径
export function getResourceDomain() {
    const token = getCookie('RESOURCE_DOMAIN');
    if (token) {
        return token;
    }
    return null;
}
// 生成永不重复的随机key
export function getRandomKey(length) {
    if (length > 0) {
        const data = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z'
        ];
        let nums = '';
        for (let i = 0; i < length; i += 1) {
            const r = parseInt(Math.random() * 61, 10);
            nums += data[r];
        }
        return nums;
    }
    return false;
}
// 数组、数组对象去重
export function uniqueArr(arr, key) {
    if (!(arr instanceof Array)) return arr;
    if (arr.length === 0) return arr;
    if (key) {
        const hash = {};
        return arr.reduce((newArr, item) => {
            if (!hash[item[key]]) {
                hash[item[key]] = true && newArr.push(item);
            }
            return newArr;
        }, []);
    }
    // eslint-disable-next-line no-undef
    return Array.from(new Set(arr));
}

// 手机号、身份证号脱敏处理
export function dataMasking(code) {
    if (code) {
        const codeNo = code.trim();
        return codeNo.length === 11
            ? codeNo.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
            : codeNo.replace(/^(.{6})(?:\w+)(.{4})$/, '$1********$2');
    }
    return code;
}
//  秒换成 天、小时、分钟
export function formatSeconds(value, m, h) {
    const t1 = m || 60; //  默认60分钟
    const t2 = h || 24; //  默认24小时
    try {
        let theTime = parseInt(value, 10); // 需要转换的时间秒
        let theTime1 = 0; // 分
        let theTime2 = 0; // 小时
        let theTime3 = 0; // 天

        let result = {
            value: theTime,
            suffix: '秒',
            data: `${theTime}秒`
        };
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60, 10);
            theTime = parseInt(theTime % 60, 10);
            result = {
                value: theTime1,
                suffix: '分钟'
            };
            if (theTime1 > t1) {
                // 大于t1分钟
                theTime2 = parseInt(theTime1 / 60, 10);
                theTime1 = parseInt(theTime1 % 60, 10);
                result = {
                    value: theTime2,
                    suffix: '小时'
                };
                if (theTime2 > t2) {
                    // 大于t2小时
                    theTime3 = parseInt(theTime2 / 24, 10);
                    theTime2 = parseInt(theTime2 % 24, 10);
                    result = {
                        value: theTime3,
                        suffix: '天'
                    };
                }
            }
        }
        let data = '';
        if (theTime1 > 0) {
            data = `${parseInt(theTime1, 10)}分${data}${theTime > 0 ? `${theTime}秒` : ''}`;
        }
        if (theTime2 > 0) {
            data = `${parseInt(theTime2, 10)}小时${data}`;
        }
        if (theTime3 > 0) {
            data = `${parseInt(theTime3, 10)}天${data}`;
        }
        if (data) {
            result.data = data;
        }
        return result;
    } catch (error) {
        return {
            value: '--',
            suffix: '分钟',
            data: '--'
        };
    }
}

/**
 *
 * @param {*} arr
 * 例 arr = [{label: '北京',value: '1'}] 转化成 {'1': '北京'}
 * 仅对属性为label,value的数组对象起作用
 */
export function listToMap(arr) {
    const map = {};
    arr.forEach((item) => {
        map[item.value] = item.label;
    });
    return map;
}

//  汉王云编码转中文
export function decodeTozh(str) {
    if (str && str !== '0') {
        const div = document.createElement('div');
        div.innerHTML = `&#${str};`;
        return div.innerHTML;
    }
    return ' ';
}

//  电子签名横屏 汉王云 坐标转换XY轴
export function chageHanyunTrailData(hanyunTrailData) {
    const dataStrArray = hanyunTrailData.split(',-1,0,');
    const newAataArray = [];
    for (let j = 0; j < dataStrArray.length; j += 1) {
        const dataStr = dataStrArray[j];
        const dataArray = dataStr.split(',');
        for (let i = 0; i < dataArray.length; i += 2) {
            const tempX = dataArray[i];
            const tempY = dataArray[i + 1];
            if (tempX < 0) {
                break;
            }
            dataArray[i] = tempY;
            dataArray[i + 1] = Math.max(2000, document.body.clientWidth * 1.5) - tempX;
        }
        newAataArray.push(dataArray.join(','));
    }
    return newAataArray.join(',-1,0,');
}

// 判断当前浏览器
export function myBrowser() {
    // eslint-disable-next-line no-undef
    const { userAgent } = navigator; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1;
    const Chrome =
        userAgent.indexOf('Chrome') > -1 &&
        userAgent.indexOf('; Win') > -1 &&
        userAgent.indexOf('Safari') > -1;
    const IE =
        (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) ||
        (userAgent.indexOf('compatible') === -1 && userAgent.indexOf('Trident') > -1);
    const Safari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
    if (isOpera) {
        return 'Opera';
    } // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF';
    } // 判断是否Firefox浏览器
    if (Chrome) {
        return 'Chrome';
    }
    if (Safari) {
        return 'Safari';
    } // 判断是否Safari浏览器
    if (IE) {
        return 'IE';
    } // 判断是否IE浏览器
    return true;
}

// 数字转中文大写
export function changeMoneyToChinese(money) {
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 汉字的数字
    const cnIntRadice = ['', '拾', '佰', '仟']; // 基本单位
    const cnIntUnits = ['', '万', '亿', '兆']; // 对应整数部分扩展单位
    const cnDecUnits = ['角', '分', '毫', '厘']; // 对应小数部分单位
    const maxNum = 999999999999999; // 最大处理的数字

    let IntegerNum; // 金额整数部分
    let DecimalNum; // 金额小数部分
    let ChineseStr = ''; // 输出的中文金额字符串
    let parts; // 分离金额后用的数组，预定义
    if (!money) return '';
    money = parseFloat(money);
    if (money > maxNum || money < 0) {
        return '';
    }
    if (money == 0) {
        [ChineseStr] = cnNums;
        return ChineseStr;
    }
    money = money.toString(); // 转换为字符串
    if (money.indexOf('.') == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split('.');
        [IntegerNum] = parts;
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) {
        // 获取整型部分转换
        let zeroCount = 0;
        const IntLen = IntegerNum.length;
        for (let i = 0; i < IntLen; i++) {
            const n = IntegerNum.substr(i, 1);
            const p = IntLen - i - 1;
            const q = p / 4;
            const m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; // 归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        // 整型部分处理完毕
    }
    if (DecimalNum != '') {
        // 小数部分
        const decLen = DecimalNum.length;
        for (let i = 0; i < decLen; i++) {
            const n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        ChineseStr += cnNums[0];
    }
    return ChineseStr;
}

// 数字转货币格式

export function numTransform(num) {
    const handle = parseFloat(num);
    if (handle) {
        const result = handle.toLocaleString();
        return result;
    }
    return num;
}

// 获取元素距页面顶部距离
export function getElementToPageTop(el) {
    console.log(el, 'ff');
    if (el.parentElement) {
        return getElementToPageTop(el.parentElement) + el.offsetTop;
    }
    return el.offsetTop;
}

/**
 * 回去权限菜单
 * @param {*} menulist  当前菜单list
 */
export const getPermissionMenu = (menulist = []) => {
    let permissionList = window.localStorage.getItem('antd-pro-authority');
    if (permissionList) {
        permissionList = JSON.parse(permissionList);
    }
    let permissionMenu = [];
    menulist.map((item) => {
        permissionList.map((sub) => {
            if (sub === item.key) {
                permissionMenu.push(item);
            }
        });
    });
    return permissionMenu;
};

/**
 * @description 找到当前key对应的组件
 * @param {*} key 为选中的tab的key
 * @param {*} menuList 为menu菜单数组
 */
export const getComponent = (key, menuList = []) => {
    let component = null;
    menuList.map((item) => {
        if (item.key === key) {
            component = item.component;
        }
    });
    return component;
};

/**
 * @description 找到当前key对应的组件
 * @param {*} key 为选中的tab的key
 * @param {*} menuList 为menu菜单数组
 */
export const getPermission = (code) => {
    // eslint-disable-next-line no-undef
    let permissionStr = sessionStorage.getItem('PERMISSION');
    let currentPermission = { authEdit: false, authExport: false, authReadOnly: false };
    if (permissionStr) {
        try {
            let permission = JSON.parse(permissionStr) || {};
            if (permission) {
                currentPermission = permission[code] || {};
            }
        } catch (error) {
            console.log(error, 'error');
        }
    }

    return currentPermission;
};

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp, pathname) {
    return pathRegexp(regexp).exec(pathname);
}

/**
 * @description: 获取地址栏拼接参数
 */
export function getParams() {
    let theRequest = {};
    let strArr = window.location.search.substring(1).split('&');
    for (let i = 0; i < strArr.length; i++) {
        theRequest[strArr[i].split('=')[0]] = decodeURI(strArr[i].split('=')[1]);
    }
    return theRequest;
}

//  获取url里?后的参数
export const getQueryString = (name) => {
    const regx = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(regx);
    if (r != null) return unescape(r[2]); return null;
};

// 导出时根据返回url直接下载文件
export function exportFile(url) {
    let downloadElement = document.createElement('a');
    downloadElement.href = url;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(url);
}

/**
 * @description: 导出文件（二进制文件流）
 * @param {*} url 接口路径
 * @param {*} data  入参
 * @param {*} successCallback 成功回调
 * @param {*} failCallback 失败回调
 */
export function downloadFile(url, data, successCallback, failCallback) {
    return axios({
        url: `${BASE_PATH.adminUrl}${url}?${qs.stringify(
            { ...data, t: Date.now() },
            { arrayFormat: 'repeat' },
        )}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            tokenId: getCookie('vipAdminToken') || ''
        }
    })
        .then(function (response) {
            let fileName = response.headers['content-disposition']
                .split(';')[1]
                .split('filename*=utf-8\'\'')[1];
            fileName = decodeURIComponent(fileName);
            let blob = response.data;
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
            if (successCallback && typeof successCallback === 'function') successCallback();
        })
        .catch(function (error) {
            if (failCallback && typeof failCallback === 'function') failCallback();
            console.log(error);
        });
}

/**
 * @description: 导出文件（二进制文件流）
 * @param {*} method 下载方法
 * @param {*} url 接口路径
 * @param {*} data  入参
 * @param {*} headers  入参
 * @param {*} callback 回调
 */
export function fileExport({ method, url, data, headers = {}, callback }) {
    console.log(headers, 'headers');
    const hide = message.loading('下载中...', 0);
    return axios({
        url: method === 'post' ? `${BASE_PATH.adminUrl}${url}` : `${BASE_PATH.adminUrl}${url}?${qs.stringify(
            { ...data, t: Date.now() },
            { arrayFormat: 'repeat' },
        )}`,
        method: method,
        responseType: 'blob',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            ...headers,
            tokenId: getCookie('vipAdminToken') || ''
        }
    })
        .then(function (response) {
            hide();
            const fileReader = new FileReader();
            fileReader.readAsText(response.data);
            fileReader.onload = function () {
                try {
                    const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
                    if (callback && typeof callback === 'function') callback({ status: 'error', message: jsonData.message || jsonData.data || '接口报错' });
                } catch (err) { // 解析成对象失败，说明是正常的文件流
                    let fileName = response.headers['content-disposition']
                        .split(';')[1]
                        .split('filename*=utf-8\'\'')[1];
                    fileName = decodeURIComponent(fileName);
                    let blob = response.data;
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob);
                    downloadElement.href = href;
                    downloadElement.download = fileName;
                    document.body.appendChild(downloadElement);
                    downloadElement.click();
                    document.body.removeChild(downloadElement);
                    window.URL.revokeObjectURL(href);
                    if (callback && typeof callback === 'function') callback({ status: 'success' });
                }
            };
        })
        .catch(function (error) {
            hide();
            if (callback && typeof callback === 'function') callback({ status: 'error' });
            console.log(error);
        });
}

//  导出excel
export function exportExcel(data) {
    const toExcel = new ExportJsonExcel(data); //new
    toExcel.saveExcel(); //保存
}

/**
 * @description 获取下载url
 */
export function getUrl(data = {}) {
    let url = null;
    if (data.signUrl) {
        url = data.signUrl;
    } else {
        url = data.baseUrl;
    }
    return url;
}

// 身份证获取性别

export function getSexFromIdCard(idCard) {
    if (!idCard) {
        return null;
    }
    if (idCard.length == 18) {
        return idCard.substring(16, 17) % 2 == 0 ? '女' : '男';
    } else if (idCard.length == 15) {
        return idCard.substring(14, 15) % 2 == 0 ? '女' : '男';
    }
    return null;
}

// 身份证获取出生日期

export function getBirthdayByIdCard(idCard) {
    if (!idCard) {
        return null;
    }
    let birthday = '';
    if (idCard.length == 15) {
        if(idCard.substring(10, 12)-0<13){
            birthday = '19' + idCard.slice(6, 12);
        }

    } else if (idCard.length == 18) {
        if(idCard.substring(10, 12)-0<13){
            birthday = idCard.slice(6, 14);
        }

    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
    return birthday;
}

// 获取性别
export function getSexByIdCard(idCard) {
    let sexMap = { 0: '女', 1: '男' };
    if (idCard.length == 15) {
        return sexMap[idCard.substring(14, 15) % 2];
    } else if (idCard.length == 18) {
        return sexMap[idCard.substring(14, 17) % 2];
    } else {
        //不是15或者18,null
        return '';
    }
}

// 根据身份证获取年龄
export function getAgeByIdCard(idCard) {
    var birthStr = getBirthdayByIdCard(idCard);
    var r = birthStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return '';
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        return Y - r[1];
    } else {
        return '';
    }
}

// 操作权限判断
export function authTransform(powerInfo) {
    let authReadOnly = false;
    let authEdit = false;
    let authExport = false;
    if (!!powerInfo) {
        if (Array.isArray(powerInfo.operations)) {
            powerInfo.operations.forEach((item) => {
                if (item.operationCode === 10) {
                    authReadOnly = item.enableStatus === 1 ? true : false;
                } else if (item.operationCode === 20) {
                    authEdit = item.enableStatus === 1 ? true : false;
                } else if (item.operationCode === 30) {
                    authExport = item.enableStatus === 1 ? true : false;
                }
            });
        }
    }

    return { authReadOnly, authEdit, authExport };
}

// 菜单权限判断
export function menuAuthTransform(menuArr) {
    let menuList = [];
    if (Array.isArray(menuArr)) {
        menuArr.forEach((item) => {
            if (item.enableStatus === 1) {
                menuList.push(item.menuCode);
            }
        });
    }
    return menuList;
}

// 获取有权限的额tabs
export function getTabs(arr) {
    const authority = JSON.parse(window.localStorage.getItem('antd-pro-authority'));
    let tabList = [];
    arr.map((item) => {
        if (authority.includes(item.permissionCode)) {
            tabList.push(item);
        }
    });
    return tabList;
}

// 判断是不是数字类型
export function isNumber(num, isConversion = true) {
    let isNumber = false;
    if (num === null) return isNumber;
    if (num === undefined) return isNumber;
    if (num === '') return isNumber;
    if (isConversion) {
        isNumber = !isNaN(num);
    } else {
        if (Object.prototype.toString.call(num) === '[object Number]') {
            isNumber = true;
        }
    }
    return isNumber;
}


// table value 格式haul
export function valuesFormat(val) {
    return isNumber(val) ? val : '--';
}

// 判断一个字符串是否为JSON字符串
export function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            // console.log('转换成功：'+obj);
            return true;
        } catch (e) {
            console.error('error：', e);
            return false;
        }
    }
    // console.log('It is not a string!')
}


export function numTransform2(num) {
    if (isNumber(num)) {
        const handle = parseFloat(num);
        if (handle) {
            const result = handle.toLocaleString();
            return result;
        }
        return num;
    }
    return '--';
}


// 对象的字符串属性去掉前后空格
export function objStringAttributeTrim(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;
    let newObj = {};
    for (let key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object String]') {
            newObj[key] = obj[key].trim();
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

// 数字转千分位
// 传入number或者string
export const numberToThousand = (val) => {
    if (!val) return null
    const num = Number(val)
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

// 千分位转数字
export const thousandToNumber = (val, thousand = ',') => {
    if (!val) return null
    return val.toString().split(thousand).join('')
}
