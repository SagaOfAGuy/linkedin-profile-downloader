import { setData, getData, waitForElementsTargetElement, elementReady,elementsReady } from '../utils/utils'
import { asBlob } from '../utils/html-docx';
import { saveAs } from 'file-saver';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.type === 'URL_CHANGE') {
        if(message.url && message.url.toString().includes("https://www.linkedin.com/in")) {
            //console.log("On linkedin profile page"); 
            
            // grab section cards
            const sections = await waitForElementsTargetElement('[data-view-name="profile-card"]',7,5000,50);
            
            // grab the full name of profile
            var name = document.querySelectorAll('a')[7].innerText.trim() === '' ? document.querySelectorAll('a')[8].innerText.trim() : document.querySelectorAll('a')[7].innerText.trim();
            var title = document.querySelector('[data-generated-suggestion-target]').innerHTML.trim(); 
            
            // Get the name of profile
            await setData('name',name); 

            // array to store innertext 
            const sectionInnerText = []; 
            
            // parse the HTML
            sections.forEach((elem) => {
                var parsedElemHTML = elem.innerHTML.replaceAll("\n","");
                parsedElemHTML = parsedElemHTML.replaceAll("\t","");
                parsedElemHTML = parsedElemHTML.replaceAll("\x3C!---->","");
                parsedElemHTML = parsedElemHTML.trim();
                sectionInnerText.push(elem.innerText);
            }); 

            // Filter the sections for relevant sections, which are 'about','education',and 'experience'
            var relevantInnerText = sectionInnerText.filter(element => element.includes('About\nAbout\n') || element.includes('Experience\nExperience\n') || element.includes('Education\nEducation\n'));

            // Remove Duplicate strings 
            relevantInnerText = relevantInnerText.map((elem) => {
                // Split the string into lines
                let lines = elem.split('\n');
                // Remove duplicates
                let uniqueLines = [...new Set(lines)];
                // Join the unique lines and replace 'Show all'
                return uniqueLines
                    .join('\n') // Combine lines back into a single string
                    .trim(); // Remove leading/trailing whitespace
            });

            // Get rid of 'show all' text 
            relevantInnerText = relevantInnerText.map((elem) => {
                // Split the string into lines
                let lines = elem.split('\n');
            
                // Filter out lines containing 'Show all'
                let filteredLines = lines.filter(line => !line.includes('Show all'));
                filteredLines = filteredLines.filter(line=> !line.includes('see more')); 
            
                // Join the remaining lines back into a single string
                return filteredLines.join('\n').trim();
            });

            // Relevant inner HTML text
            var relevantInnerTextHTML = `<h1>${name}</h1><h3>${title}</h3>`; 

            // Create the HTML 
            relevantInnerText.forEach((elem)=> {
                var elemArray = elem.split('\n'); 
                //console.log(elemArray);
                // Print out the HTML based on the text
                elemArray.forEach((e,index)=>{
                    if(e === 'Education') {
                        relevantInnerTextHTML += '<br><h2><u>Education</u></h2>';
                    }
                    else if(e === 'About') {
                        relevantInnerTextHTML += '<br><h2><u>About</u></h2>';
                    }
                    else if(e === 'Experience') {
                        relevantInnerTextHTML += '<br><h2><u>Experience</u></h2>';
                    }
                    else {
                        relevantInnerTextHTML +=  `<p>${e}</p>`; 
                    }
                })
            })
            //console.log(relevantInnerTextHTML); 

            // Set the relevant sections
            await setData('relevantInnerText',relevantInnerText);
            await setData('relevantInnerTextHTML', relevantInnerTextHTML);

            // Create download button on Linkedin page
            await createDownloadButton(); 
            
            // Delete any extra buttons that happen to be created
            await deleteExtraButtons();
        }
    }
});

// Download file from blob
const downloadFileFromBlob = async (html,filename) => {
    var converted = asBlob(html);
    //console.log(converted); 
    saveAs(converted, filename); 
}
// Create download button
const createDownloadButton = async () => {
    // Wait until profile section is loaded on linkedin
    const profile = await elementReady('.artdeco-card');
    // button we create to put in the linkedin profile area
    const button = document.createElement('button');
    var name = await getData("name");
    // relevant sections HTML we grab from the chrome database
    var relevantInnerTextHTML = await getData('relevantInnerTextHTML');
    // Define our desired button attributes. We use the linkedin button class to mimic the CSS
    button.innerText = `Download Profile DOCX`;
    button.className = "download-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view";
    button.style.margin = "20px"; 
    button.style.padding = "5px";
    // Add onclick function to download resume doc file 
    button.onclick= async () => {
        await downloadFileFromBlob(relevantInnerTextHTML,`${name}_Linkedin_Profile.docx`);
    }
    // Add the button to the profile section
    profile.appendChild(button); 
}
// Delete extra buttons on webpage
const deleteExtraButtons = async () => {
    // grab element per the class name we created for our download button
    const myButton = await elementsReady('.download-btn');
    // if length > 1, delete any extra buttons
    if(myButton.length > 1) {
        for(var i = 0; i < myButton.length-1; i++) {
            myButton[i].remove(); 
        }
    }
}