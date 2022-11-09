import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";
import UploadService from "../services/FileUploadService";
import GetAvailabilityService from "../services/GetAvailabilityService";
import ShowAvailability from "./ShowAvailability";
import "../css/FileUpload.css";

const UploadFiles = () => {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [showUploadedCard, setShowUploadedCard] = useState(false);
  const [showAvailableCard, setShowAvailableCard] = useState(false);
  const [availableCard, setAvailabeCard] = useState(undefined);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "csv.",
    onDrop: (acceptedFiles) => {
      setCurrentFile(acceptedFiles[0].path);
      requestToUpload(acceptedFiles[0], acceptedFiles[0].path);
    },
  });

  const upload = (event) => {
    setMessage("");
    let currentFile = event.target.files;
    let fileName = event.target.files[0].name;
    requestToUpload(currentFile, fileName);
  };

  const requestToUpload = (currentFile, fileName) => {
    console.log(currentFile);
    if (isCSVextension(fileName)) {
      setShowUploadedCard(true);
      setProgress(0);
      setCurrentFile(fileName);

      const unique_id = uuid();
      UploadService.upload(currentFile, unique_id, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
        .then((response) => {
          setProgress(response.data.data.progress);
        })
        .then(() => {
          getServiceAvailable(unique_id);
        })
        .catch((err) => {
          setProgress(0);
          setMessage("Could not upload file");
          setCurrentFile(undefined);
          setShowUploadedCard(false);
        });
    }
  };

  const isCSVextension = (fileName) => {
    let extension = fileName.split(".");
    if (extension[1].toLowerCase() !== "csv") {
      setMessage("Please upload CSV file");
      setProgress(0);
      setCurrentFile(undefined);
      return false;
    }
    return true;
  };

  const getServiceAvailable = (userId) => {
    GetAvailabilityService.getAvailability(userId)
      .then((response) => {
        console.log(response.data);
        setAvailabeCard(response.data);
        setTimeout(() => {
          setShowAvailableCard(true);
          setShowUploadedCard(false);
        }, 3000);
      })
      .catch(() => {
        setMessage("Could not check availability service");
        setShowAvailableCard(false);
      });
  };

  return (
    <>
      <div class="max-w-xl">
        <div className="Box">
          <label
            htmlFor="dropzone-file"
            class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div
              class="flex flex-col justify-center items-center pt-5 pb-6"
              {...getRootProps()}
            >
              <img
                class="object-scale-down h-10 w-10 ..."
                src="https://cdn3.iconfinder.com/data/icons/file-extension-11/512/csv-file-extension-format-excel-512.png"
              ></img>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">
                  Drag your .csv file here to start uploading.
                </span>
                <br></br>
                <p class="text-center top-5">OR</p>
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              {...getInputProps()}
            />
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClick}
            >
              Browse
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={upload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div role="alert">
          <div className="px-4 py-2 font-bold text-white bg-red-500 rounded-t">
            {message}
          </div>
        </div>
        {showUploadedCard && (
          <div class="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
            <img
              class="object-scale-down h-10 w-10 ..."
              src="https://cdn3.iconfinder.com/data/icons/file-extension-11/512/csv-file-extension-format-excel-512.png"
            ></img>
            <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
              {currentFile}
            </p>
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}
      </div>
      {showAvailableCard && <ShowAvailability availableCard={availableCard} />}
    </>
  );
};

export default UploadFiles;
