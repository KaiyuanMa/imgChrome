# imgChrome

Web Image Translator, translate text within image to desired language. The extension will create a translated image and it will; replace the old image.



# IMPORTANT
CROS needs to be allowed for this extension to work.
How to allow CROS:
1. Go to https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf
2. Add the extension to your chrome.
3. Enable cros.

Why do I need to enable CROS?

CROS enbale the extension to download the image from websites, and It should be turned off when not using the extension. Google Access-Control-Allow-Origin for more info.



# How to use:
1. Go to chrome extension store and search for Web Image Translator.
2. After install, look for the extension icon on top right or click the puzzle icon and top right.
3. Click the extension icon to open setting.
4. Choose the desired outcome language, textflow, and lineflow.
5. Hover on the image and right click, look for the option "Translate image" and click it. The image should be translated after a couple of seconds.

# How it works:
The extension uses google cloud vision to detected text within the image, and google cloud translate to translate the text, and lastly using canvas to draw the translated text back to the old image, and than replace the img src to replace the old image to translated image. 
