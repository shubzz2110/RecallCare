import { prisma } from "../../config/prisma";
import { fakerEN_IN as faker } from "@faker-js/faker";

async function main() {
  const args = process.argv.slice(2);

  const positionalArguments = args.filter((a) => !a.startsWith("--"));

  const clinicId = positionalArguments[0];
  const seedPatientsCount = Number(positionalArguments[1]) || 50;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(clinicId)) {
    console.error("❌ Error: Invalid organization ID format (expected UUID)");
    process.exit(1);
  }

  try {
    const startTime = Date.now();
    let patientsCount = 0;

    const patientsToSeed = [];

    for (
      let patientsCount = 0;
      patientsCount < seedPatientsCount;
      patientsCount++
    ) {
      const indianPhone = faker.phone.number({ style: "international" });
      const patient = {
        phone: `${indianPhone}`,
        name: faker.person.fullName(),
        notes: faker.lorem.lines(1),
        clinicId,
      };
      patientsToSeed.push(patient);
    }

    await prisma.patient.createMany({ data: [...patientsToSeed] });

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log("50 Patient Seeded Successfully");
    process.exit(0);
  } catch (error) {
    console.error("Unable to seed");
    process.exit(1);
  }
}
if (require.main === module) {
  main();
}
