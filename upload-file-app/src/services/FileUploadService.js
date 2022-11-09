import http from "../http-commons";

const upload = (file, unique_id, onUploadProgress) => {
  let formData = new FormData();

  if(typeof(file) == FileList){
    formData.append("file", file[0]);
  }else{
    formData.append("file", file);
  }
  formData.append("userId", unique_id);
  formData.append("progress", onUploadProgress);
 
  return http.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
};

export default { upload };
