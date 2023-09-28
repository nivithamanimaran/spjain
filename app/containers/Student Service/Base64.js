import React from 'react';

export default function Base64({ setBase64, setFile, fileError }) {
  // state = {
  //   file: null,
  //   base64URL: '',
  // };

  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = '';
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log('Called', reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
      };
      return fileInfo;
    });
  };

  const handleFileInputChange = e => {
    console.log(e.target.files[0]);

    let file = e.target.files[0];

    getBase64(file)
      .then(result => {
        console.log(result);
        file['base64'] = result;
        console.log('File Is', file);
        setBase64(result);
        setFile(file);
      })
      .catch(err => {
        // console.log(err);
      });
  };

  return (
    <div>
      <input type="file" name="file" onChange={handleFileInputChange} />
    </div>
  );
}
