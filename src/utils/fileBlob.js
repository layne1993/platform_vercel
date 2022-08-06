export const exportFileBlob = (file,fileName)=>{
  let blob = new Blob([file], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}`);
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = e => {
      const a = document.createElement('a');
      a.download = fileName;
      a.href = e.target.result;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  }
}