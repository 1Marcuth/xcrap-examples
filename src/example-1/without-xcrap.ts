import htmlParser from "node-html-parser"
import axios from "axios"
import path from "path"

import writeJsonFile from "../helpers/write-json-file"

async function start() {
    const url = "https://quotes.toscrape.com/"
    const response = await axios.get(url)
    const document = htmlParser.parse(response.data)

    const quotes = document.querySelectorAll(".quote")
    
    const quotesData = quotes.map(quote => {
        const textElement = quote.querySelector(".text")
        const authorElement = quote.querySelector(".author")
        const aboutAuthorPagePathElement = quote.querySelector("span a")

        const tags = quote
            .querySelectorAll(".tag")
            .map(tag => tag.innerText)

        return {
            text: textElement?.innerText,
            author: authorElement?.innerText,
            aboutAuthorPagePath: aboutAuthorPagePathElement?.getAttribute("href"),
            tags: tags,
        }
    })

    const topTenTags = document
        .querySelectorAll(".tag-item .tag")
        .map(tag => tag.innerText)

    const pageData = {
        topTenTags: topTenTags,
        quotes: quotesData
    }

    // Visualização e salvamento de dados

    const outputFilePath = path.join(__dirname, "without-xcrap.json")
    await writeJsonFile(outputFilePath, pageData, 4)
    console.dir(pageData, { depth: null })
}

start()