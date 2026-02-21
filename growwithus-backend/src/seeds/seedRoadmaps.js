const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Roadmap = require("../models/roadmap.model");
const roadmaps = require("./data/roadmaps.data");

dotenv.config();

async function seedRoadmaps() {
  try {
    await connectDB();

    const results = await Promise.all(
      roadmaps.map((roadmap) =>
        Roadmap.findOneAndUpdate(
          { slug: roadmap.slug.toLowerCase().trim() },
          {
            ...roadmap,
            slug: roadmap.slug.toLowerCase().trim()
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true
          }
        )
      )
    );

    console.log(`Seeded ${results.length} roadmap(s) successfully.`);
  } catch (error) {
    console.error("Roadmap seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seedRoadmaps();

