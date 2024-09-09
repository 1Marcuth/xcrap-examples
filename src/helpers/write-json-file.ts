import fs from "fs"

async function writeJsonFile(filePath: string, data: any, indent: number) {
    const dataSting = JSON.stringify(data, null, indent)
    fs.promises.writeFile(filePath, dataSting)
}

export default writeJsonFile