    npm i -D typescript
    npm i -D --save-exact prettier
    npx tsc --watch

All typescript code must be put into a single typescript source file, so the resulting single javascript file is not a module and can be used in html even if loaded from file - loading modules from file results in CORS errors due to JavaScript module security requirements.
