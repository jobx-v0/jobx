import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const VideoRecorder = ({ questionId, jobId, userId, onTimerActiveChange }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [thinkingTime, setThinkingTime] = useState(30); // 30 seconds for thinking
  const [recordingTime, setRecordingTime] = useState(150); // 2 mins 30 seconds for recording
  const [timerActive, setTimerActive] = useState(true);
  const [showRecordingIcon, setShowRecordingIcon] = useState(false);

  // Effect to notify parent component of timerActive changes
  useEffect(() => {
    onTimerActiveChange(timerActive);
  }, [timerActive, onTimerActiveChange]);

  useEffect(() => {
    // Reset or perform actions when questionId changes
    setCapturing(false);
    setRecordedChunks([]);
    setThinkingTime(30); // Reset thinking time if needed
    setRecordingTime(150); // Reset recording time if needed
    setTimerActive(true);
    setShowRecordingIcon(false);
  }, [questionId]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => [...prev, data]);
      }
    },
    [recordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      setRecordingTime(0);
      setShowRecordingIcon(false);
      setTimerActive(false);
    }
  }, []);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setThinkingTime(0);
    setShowRecordingIcon(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [handleDataAvailable]);

  const uploadToAzure = async (blob) => {
    try {
      // Fetch the SAS URL from your server
      const response = await axios.get(
        `http://localhost:3004/api/azure/sas/${userId}/${jobId}/${questionId}`
      );
      const { sasUrl } = response.data;

      console.log("SAS URL:", sasUrl);

      // Upload the blob to Azure Blob Storage using the SAS URL
      await axios.put(sasUrl, blob, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
        },
      });

      console.log("Upload to Azure Blob Storage successful");
    } catch (error) {
      console.error("Error uploading to Azure Blob Storage:", error);
    }
  };

  useEffect(() => {
    if (!capturing && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      uploadToAzure(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks, capturing]);

  useEffect(() => {
    if (timerActive) {
      const thinkingTimer = setTimeout(() => {
        if (!capturing) {
          handleStartCaptureClick();
        }
        const recordingTimer = setTimeout(() => {
          if (capturing) {
            handleStopCaptureClick();
          }
        }, recordingTime * 1000);

        return () => clearTimeout(recordingTimer);
      }, thinkingTime * 1000);

      return () => clearTimeout(thinkingTimer);
    }
  }, [
    thinkingTime,
    recordingTime,
    timerActive,
    capturing,
    handleStartCaptureClick,
    handleStopCaptureClick,
  ]);

  useEffect(() => {
    let interval;
    if (timerActive && thinkingTime > 0) {
      interval = setInterval(() => {
        setThinkingTime((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && recordingTime > 0 && capturing) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [thinkingTime, recordingTime, timerActive, capturing]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="w-[98%] h-full mb-4 relative">
        <Webcam
          audio={true}
          ref={webcamRef}
          muted={true}
          className="w-full h-full rounded-lg shadow-lg border-10 border-gray-300 "
        />
        {showRecordingIcon && (
          <div className="absolute top-0 left-0 m-2 p-2 bg-red-600 text-white rounded-full">
            Recording...
          </div>
        )}
        <div className="absolute bottom-0 left-0 m-2 p-2 bg-white text-black rounded-lg">
          {thinkingTime > 0 && !capturing
            ? `Recording will start in ${thinkingTime} seconds`
            : recordingTime > 0 &&
              `Recording will stop in ${recordingTime} seconds`}
        </div>
      </div>
      <div className="flex space-x-4">
        {thinkingTime > 0 && !capturing && (
          <button
            onClick={handleStartCaptureClick}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Start Capture
          </button>
        )}
        {recordingTime > 0 && capturing && (
          <button
            onClick={handleStopCaptureClick}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Stop Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
