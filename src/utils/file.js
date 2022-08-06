import axios from 'axios';

export const exportFile = async (params) => {
    const token = localStorage.getItem('token');

    const file = await axios({
        method: params.req || 'post',
        url:params.url,
        responseType: 'arraybuffer',
        headers: {
            token,
            tokenId:params.tokenId || ''
        },
        data:params.data
    });
    // console.log(file,'导出的file')
    let blob = new Blob([file.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, `${params.fileNames}`);
    } else {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (e) => {
            const a = document.createElement('a');
            a.download = params.fileNames;
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
};
