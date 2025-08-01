const { MongoClient } = require('mongodb')
require("dotenv").config({path: "./config.env"})

async function main() {
    const Db = process.env.ATLAS_URL
    
    if (!Db) {
        console.error("No connection string found!")
        return
    }
    
    const client = new MongoClient(Db, {
        serverSelectionTimeoutMS: 5000,
    })

    try {
        await client.connect()
        console.log("Connected to MongoDB!")
        
        const db = client.db("intern")
        console.log("Using database: intern")
        await db.admin().ping()

        const result = await db.collection("users").insertOne({
            name: "Testicals User",
            email: "test@example.com",
            createdAt: new Date()
        })
        console.log("Insert result:", result.insertedId)
        
    } catch (e){
        console.error("Error occurred:", e.message)
    } finally {
        try {
            await client.close()
            console.log("Connection closed")
        } catch (e) {
            console.error("Error closing connection:", e.message)
        }
    }
}

main()