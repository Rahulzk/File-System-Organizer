let fs = require('fs');
let path = require('path');
let inputArr = process.argv.slice(2);

//node main.js tree "dire path"
//node main.js organize "dire path"
//node main.js help

let types = {
    Madia : ['mp4','mkv'],
    Archives : ['zip','rar','js','c','cpp','js','java'],
    Documents : ['pdf','docx','doc','xlsx','xls','txt'],
    App : ['exe','pkg','deb']
}


let command = inputArr[0];

switch(command){
    case "tree":{
        treeFn(inputArr[1]);
        break;
    }
        
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case 'help':
        helpFn();
        break;
    case "default":
        console.log('Write right command');
}

function treeFn(DirPath){
    // console.log("tree command implemented for "+ DirPath);

    if(DirPath == undefined){
        console.log("Kindly input the path");
        return ;
    }else{
       let isPre = fs.existsSync(DirPath);
       if(isPre){
        treeHelper(DirPath," ");
        
       }else{
           console.log("Kindly input the valid path of directory");
           return;
       }
    }

}

function treeHelper(Dirpath,indent){
    let isFile = fs.lstatSync(Dirpath).isFile();
    if(isFile){
        let fileName = path.basename(Dirpath);
        console.log(indent + "|---" + fileName);
    }else{
        let dirName = path.basename(Dirpath);
        console.log(indent + "|___" + dirName);
        let child = fs.readdirSync(Dirpath);
        for(let i = 0; i < child.length;i++){
            let childPath = path.join(Dirpath,child[i]);
            treeHelper(childPath,indent+"\t");
        }
    }
}

function organizeFn(DirPath){

    // console.log("organize command implemented for "+ DirPath);
    // 1. take input --> path of directory

     if(DirPath == undefined){
         console.log("Kindly input the path");
         return ;
     }else{
        let isPre = fs.existsSync(DirPath);
        if(isPre){
             // 2. make directory of organize 

            let destpath = path.join(DirPath,"organized_files");
            if(!fs.existsSync(destpath))
                fs.mkdirSync(destpath);
                organize_helper(DirPath,destpath);
        }else{
            console.log("Kindly input the valid path of directory");
            return;
        }
     }

      // 3. Idetify categries of all existing file 
 }

function organize_helper(src,des){
    let child = fs.readdirSync(src);
    for(let i = 0; i < child.length; i++){
      let childPath = path.join(src,child[i]);
      let isFile = fs.lstatSync(childPath).isFile();
      if(isFile){
        let extension = path.extname(child[i]).slice(1);
        //    console.log(extension);
        let category = getCategory(extension);
        console.log(child[i]," belongs to",category);
        sendFile(childPath,des,category);
      }
    }
}

function getCategory(ext){
    for(let  type in types){
        for(let i = 0; i < types[ type].length; i++){
            if(types[ type][i] == ext)return  type;
        }
    }
  return "other";
}

 function sendFile(src,des,category){
     let categoryPath = path.join(des,category);

     if(!fs.existsSync(categoryPath))
       fs.mkdirSync(categoryPath);
     let fileName = path.basename(src);
     let destPath = path.join(categoryPath,fileName);

     fs.copyFileSync(src,destPath);   
}

function helpFn(){
   console.log(`
     List of All commands:
         node main.js tree "Dirpath"
         node main.js organize "Dirpath"
         node main.js help

   `);
}
