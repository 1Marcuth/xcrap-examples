import { extractAttribute, extractInnerText, ParsingModel } from "xcrap/parsing"
import { AxiosClient } from "xcrap/clients"

import writeJsonFile from "../helpers/write-json-file"
import path from "path"

const quoteParsingModel = {
    text: {
        query: ".text",
        extractor: extractInnerText
    },
    author: {
        query: ".author",
        extractor: extractInnerText
    },
    aboutAuthorPagePath: {
        query: "span a",
        extractor: extractAttribute("href")
    },
    tags: {
        query: ".tag",
        extractor: extractInnerText,
        fieldType: "multiple"
    }
} satisfies ParsingModel

const pageParsingModel = {
    topTenTags: {
        query: ".tag-item .tag",
        extractor: extractInnerText,
        fieldType: "multiple"
    },
    quotes: {
        query: ".quote",
        model: quoteParsingModel,
        isGroup: true
    }
} satisfies ParsingModel

async function start() {
    const client = new AxiosClient()

    const url = "https://quotes.toscrape.com/"
    const pageParser = await client.get(url)

    const pageData = pageParser.parseItem({ model: pageParsingModel })

    // Visualização e salvamento de dados

    const outputFilePath = path.join(__dirname, "with-xcrap.json")
    await writeJsonFile(outputFilePath, pageData, 4)
    console.dir(pageData, { depth: null })
}

start()