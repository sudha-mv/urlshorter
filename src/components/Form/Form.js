import React, { useState } from "react";
import styles from "./Form.module.css";
import axios from "axios";

const serverBase = process.env.REACT_APP_SERVERURL || "http://localhost:5000";

function is_url(str) {
  let exp = new RegExp(

  );
  return exp.test(str);
}

function fix_url(url) {
  if (url.substring(0, 7) === "http://" || url.substring(0, 8) === "https://") {
    return url;
  } else {
    return `http://${url}`;
  }
}

export default function Form(props) {
  const [inputURL, setInputURL] = useState("");

  const handleChange = (event) => {
    setInputURL(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    props.setErrMsg(null);
    props.setLoading(true);

    if (!is_url(inputURL)) {
      props.setLoading(false);
      props.setErrMsg("Unable to shorten that link. It is not a valid URL.");
      return;
    }

    const longURL = fix_url(inputURL);
    const postData = { full: longURL };

    axios
      .post(`${serverBase}/short`, postData)
      .then((res) => props.setFetchedData(res.data[0]))
      .catch((err) => {
        props.setErrMsg("Something Went Wrong.");
        props.setLoading(false);
        console.error(err);
      });

    setTimeout(() => {
      props.setLoading(false);
      setInputURL("");
    }, 1000);
  }

  return (
    <form
      className={styles.formstyle}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div className={styles.textfieldContainer}>
        <input
          className={styles.textfieldStyle}
          required
          type="url"
          onChange={handleChange}
          value={inputURL}
          placeholder="Enter a URL"
        />
        <button className={styles.shortenButton} type="submit">
          Shorten
        </button>
      </div>
    </form>
  );
}
