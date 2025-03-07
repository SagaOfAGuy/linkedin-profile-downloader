# Linkedin Profile Downloader
Chrome extension that allows for users to scrape Linkedin Profile information and save it as a DOCX file.

**Chrome Web Store Link:** https://chromewebstore.google.com/detail/linkedin-profile-download/ebjdfpoegdaamleafgbedpimdgjlplja?authuser=0&hl=en 


# Installation
1. Open Chrome browser
2. Browse to the URL `chrome://extensions` in the Chrome browser
3. Enable `Developer Mode` 

![alt text](imgs/image.png)

4. Download this chrome extension repo: 
```bash
git clone https://github.com/SagaOfAGuy/react-linkedin-resume-extension.git
```

5. Click the `Load Unpacked` button in the browser

![alt text](imgs/image-1.png)

6. Browse to the directory that has the chrome extension downloaded, and chose to import the `dist` folder and click on the `select` button

![alt text](imgs/image-2.png)

7. Confirm that the extension has been installed:

![alt text](imgs/image-3.png)

# Usage
To use the extension, we can follow these steps below: 

1. Browse to a Linkedin Profile page in the chrome browser
2. Refresh the webpage (This is important!). 
3. Click the `Download Profile DOCX` button to download the profile information when it appears

![alt text](imgs/image-4.png)

# Building the extension (Optional)
1. To build this extension, we first need to download any dependency packages. To do this, we can run the command below to install needed packages. Note that we should be in the `react-linkedin-resume-extension` folder when running these commands: 
```bash
npm install 
```
2. We can build this extension from source code via the command below: 

```bash
npm run build
```
