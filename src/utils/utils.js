// Store Data into Chrome database
export function setData(keyName, value) {
    return new Promise((resolve, reject) => {
      const data = {};
      data[keyName] = value;
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(`${keyName} has been inserted or updated`);
        }
      });
    });
}

// Get data from Chrome database
export async function getData(keyName) {
    return new Promise((resolve, reject) => {
    chrome.storage.local.get([keyName], (result) => {
      if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
      } else {
          resolve(result[keyName]);
      }
    });
  });
}

// wait until elements load on webpage
export function elementsReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelectorAll(selector);
    if (el) {
      console.log('it exists');
      resolve(el); 
      return
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        console.log('element found?');
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}

// wait until element load on webpage
export function elementReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {
      //console.log('it exists');
      resolve(el); 
      return
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        console.log('element found?');
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}

// wait for element arrays
export function waitForElementsTargetElement(selector, targetLength, timeout = 5000, interval = 100) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElements = () => {
      const elements = document.querySelectorAll(selector);

      // Check if the number of elements matches the target length
      if (elements.length >= targetLength) {
        console.log(elements);
        resolve(Array.from(elements)); // Resolve with the array of elements
        return;
      }

      // Timeout logic
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout: Expected ${targetLength} elements, but found ${elements.length} within ${timeout}ms.`));
        return;
      }

      // Recheck after the interval
      setTimeout(checkElements, interval);
    };

    checkElements();
  });
}

