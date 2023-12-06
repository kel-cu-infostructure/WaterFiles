document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("directory").textContent = `Directory: ${window.location.pathname}`
    getFiles();
    console.log(`Сайт загружен!`)
})

async function getFiles(){
    if((window.location.pathname.startsWith("/ass") || window.location.pathname.startsWith("/cdn")) && !window.location.hostname.startsWith("cdn")){
        document.location = `//cdn.kelcuprum.ru${window.location.pathname.substring(4, window.location.pathname.length)}`;
        return;
    } else if(!window.location.hostname.startsWith("cdn")) {
        document.location = `//cdn.kelcuprum.ru${window.location.pathname}`;
        return;
    }
    const data = await fetch(`/files?path=${window.location.pathname}`);
    let file = await data.json();
    let dir = []
    let files = []
    for(i = 0; i<file.length;i++){
        if(file[i].isDir) dir.push(file[i]);
        else files.push(file[i]);
    }

    for(i = 0; i<dir.length;i++){
        let linkFile = document.createElement(`a`);
        linkFile.href = dir[i].path;
        linkFile.innerText = `/${dir[i].name}`;
        let newFile = document.createElement(`li`);
        newFile.append(linkFile)
        document.getElementById("files").append(newFile)
    }
    for(i = 0; i<files.length;i++){
        let linkFile = document.createElement(`a`);
        linkFile.href = files[i].path;
        linkFile.innerText = `- ${files[i].name}`;
        let newFile = document.createElement(`li`);
        newFile.append(linkFile)
        document.getElementById("files").append(newFile)
    }
    console.log(dir);
    console.log(files);
    // console.log(file); 
}