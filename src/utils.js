import axios from "axios";
import fsp from "fs/promises"
import path from "path";

export default (url, filePath) => {
    axios.get(url)
  .then(response => {
    fsp.access(filePath).then(resAcc => {
        fsp.writeFile(filePath, response.data).then(resWrite =>{
            console.log(`Page was successfully downloaded into ${filePath}`)
        })
        .catch(errWrite => {
            console.log('Page write error', errWrite)
        }) 
    }).catch(errAcc => {
        const dir = path.dirname(filePath)
        fsp.mkdir(dir, { recursive: true }).then(resDir => {
            fsp.writeFile(filePath, response.data).then(resWrite =>{
                console.log(`Page was successfully downloaded into ${filePath}`)
            })
            .catch(errWrite => {
                console.log('Page write error', errWrite)
            }) 
        }).catch(errDir => {
            console.log(`Directory creation error ${errDir}`)
        })
      })
    })
  .catch(error => {
    console.error(`Invalid URL ${error}`);
  });
}

