import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import axiosInstance from "../utils/axiosinstance";

export default function Editor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [designName, setDesignName] = useState('');
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, { height: 600, width: 800, backgroundColor: '#fff' });
    setCanvas(c);
    // Optionally load saved designs here...
  }, []);

  const addText = () => {
    const text = new fabric.Textbox('Type here', { left: 50, top: 50 });
    canvas.add(text);
  };
const saveDesign = async () => {
  // Always try to get the latest user from Redux or sessionStorage
  let storedUser = user && user._id ? user : null;
  if (!storedUser) {
    try {
      storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      storedUser = {};
    }
  }
  const userId = storedUser?._id || "";
  const username = storedUser?.username || "";

  let name = prompt("Enter a name for your design:", "Untitled Design");
  if (name === null) return;
  name = name.trim() || "Untitled Design";

  const payload = {
    Shapes: Array.isArray(shapes) ? shapes : [],
    name,
    createdBy: userId,
    username
  };

  console.log("DEBUG POST BODY:", payload);

  if (!userId || !username) {
    alert("User info missing – please login and try again.");
    return;
  }
  if (!payload.Shapes.length) {
    alert("Please create something on canvas before saving.");
    return;
  }

  try {
    const res = await axiosInstance.post("/api/designs", payload);
    if (res?.data) {
      dispatch(fetchDesigns());
      alert("Design saved successfully!");
    }
  } catch (error) {
    console.error("Error saving design:", error?.response?.data || error.message);
    alert("Failed to save design: " + (error?.response?.data?.message || error.message));
  }
};



  return (
    <div>
      <input
        value={designName}
        onChange={e => setDesignName(e.target.value)}
        placeholder="Design Name"
      />
      <button onClick={addText}>Add Text</button>
      <button onClick={saveDesign}>Save</button>
      <canvas ref={canvasRef} />
    </div>
  );
}
