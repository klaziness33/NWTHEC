/**
 * Helpers Functions
 */
import moment from "moment";
const CryptoJS = require("crypto-js");
import AppConfig from "../constants/AppConfig";
// const image2base64 = require('image-to-base64');

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      alpha +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
  let time = timestamp * 1000;
  let formatDate = format ? format : "MM-DD-YYYY";
  return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
 */
export function convertDateToTimeStamp(date, format) {
  let formatDate = format ? format : "YYYY-MM-DD";
  return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
  let location = url.pathname;
  let path = location.split("/");
  return path[1];
}

export function encryptData(inputP) {
  if (inputP === undefined || inputP === "" || inputP === null) {
    return "";
  }
  const ciphertext = CryptoJS.AES.encrypt(inputP, AppConfig.cryptoKey);
  return ciphertext.toString();
}

export function decryptData(inputP) {
  if (inputP === undefined || inputP === "" || inputP === null) {
    return "";
  }
  const bytes = CryptoJS.AES.decrypt(inputP, AppConfig.cryptoKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

export function parseDateInt(jsonDateString) {
  const part1 = jsonDateString.replace("/Date(", "");
  const part2 = part1.replace(")/", "");
  return parseInt(part2);
}

export function parseDateString(jsonDateString) {
  return "/Date(" + jsonDateString + ")/";
}

export function convertDateToWebservice(date, format) {
  return moment(date).format("DD/MM/YYYY");
}

export function roundN(num, n) {
  return parseFloat(
    Math.round(num * Math.pow(10, n)) / Math.pow(10, n)
  ).toFixed(n);
}

export function addPropsToObject(objectP, propsNewP) {
  let arrayListsL = [];

  if (objectP.length == 0) return arrayListsL;
  for (let index = 0; index < objectP.length; index++) {
    const objectL = objectP[index];
    let objectSubL = {};
    // new props //
    for (let index = 0; index < propsNewP.length; index++) {
      objectSubL[propsNewP[index][0]] = propsNewP[index][1];
    }
    // old props //
    for (const pL in objectL) {
      if (objectL.hasOwnProperty(pL)) {
        objectSubL[pL] = objectP[index][pL];
      }
    }

    // add to array
    arrayListsL.push(objectSubL);
  }
  return arrayListsL;
}

export function getHttpBase64(nameImgP, cb) {
  var xhr = new XMLHttpRequest();
  let pathL = require("../assets/data/revenue/" + nameImgP);
  xhr.open("GET", pathL, true);
  xhr.responseType = "blob";
  xhr.onload = function(e) {
    var reader = new FileReader();
    reader.onload = async function(event) {
      return await cb(event.target.result);
    };
    var file = this.response;
    reader.readAsDataURL(file);
  };
  xhr.send();
}

export function getBase64(file, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function() {
    await cb(reader.result);
  };
  reader.onerror = function(error) {
    console.log("Error: ", error);
  };
}
