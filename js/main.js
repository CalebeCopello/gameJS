const CV = document.getElementById('display')
const CTX = CV.getContext('2d')

document.addEventListener('DOMContentLoaded', () => {
    displaySize()
})

function displaySize(s=1) {
    CV.width="256" 
    CV.height="240"
    CV.width*=s
    CV.height*=s
}