var config = {
    frontSrc: './app-frontend',
    backendSrc: './app-backend',
    deploy: './deploy'
};

//front
config.frontSrcJs = config.frontSrc + '/js/';
config.frontSrcImgs = config.frontSrc + '/public/img';
config.frontSrcFonts = config.frontSrc + '/public/fonts';
config.frontSrcLibs = config.frontSrc + '/public/vendors';
config.frontSrcSass = config.frontSrc + '/public/sass';
config.frontSrcCss = config.frontSrc + '/public/css';
config.frontSrcHtml = config.frontSrc;
config.frontSrcTemplates = config.frontSrc + 'templates/';

config.frontDeploy = config.deploy + '/front/';
config.frontJsDeploy = config.frontDeploy + 'js/';
config.frontSassDeploy = config.frontDeploy + 'css/';
config.frontCssDeploy = config.frontDeploy + 'css/';
config.frontTemplatesDeploy = config.frontDeploy + 'templates/';
config.frontHtmlDeploy = config.frontDeploy;
config.frontImgsDeploy = config.frontDeploy + 'img/';
config.frontFontsDeploy = config.frontDeploy + 'fonts/';

//backend
config.backendSrcJs = config.backendSrc + '/js/';
config.backendDeploy = config.deploy + '/backend';

module.exports = config;