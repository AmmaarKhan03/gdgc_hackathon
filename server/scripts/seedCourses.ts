import { readFileSync } from "fs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const institution = await prisma.institution.upsert({
    where: { name: "UCSC" },
    update: {},
    create: { name: "UCSC", domain: ["ucsc.edu"] }
  });

  const csv = readFileSync("data/ucsc_courses.csv", "utf8").trim().split("\n");
  const [header, ...rows] = csv;
  for (const line of rows) {
    if (!line.trim()) continue;
    const [subjectRaw, codeRaw, ...rest] = line.split(",");
    const subject = subjectRaw.trim().toUpperCase();
    const code = codeRaw.trim().toUpperCase().replace(/\s+/g, "");
    const title = rest.join(",").trim();
    const searchText = `${subject} ${code} ${title}`.toLowerCase();

    await prisma.course.upsert({
      where: {
        institutionId_subject_code: {
          institutionId: institution.id,
          subject,
          code
        }
      },
      update: { title, searchText },
      create: {
        institutionId: institution.id,
        subject,
        code,
        title,
        searchText,
        aliases: []
      }
    });
  }
  console.log("Seeded courses.");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
