import React, { useState } from "react";

function CreateArea(props) {
  const [inputText, setInputText] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInputText((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  }

  return (
    <div>
      <form>
        <input 
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={inputText.title} 
        />
        <textarea
            name="content"
            placeholder="Take a note..."
            rows="3"
            onChange={handleChange}
            value={inputText.content} 
        />

        <button
          onClick={(event) => {
            event.preventDefault();
            props.onAdd(inputText);
            setInputText({ title: "", content: "" });
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default CreateArea;
